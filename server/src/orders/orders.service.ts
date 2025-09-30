import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string | null, createOrderInput: CreateOrderInput) {
    // Generate order number
    const orderCount = await this.prisma.order.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(3, '0')}`;

    // Validate products and calculate total
    let total = 0;
    const orderItems = [];

    for (const item of createOrderInput.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for product ${product.name}`);
      }

      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order with transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      // Create the order
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerName: createOrderInput.customerName,
          customerEmail: createOrderInput.customerEmail,
          shippingAddress: createOrderInput.shippingAddress,
          phoneNumber: createOrderInput.phoneNumber,
          notes: createOrderInput.notes,
          total,
          userId,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
          user: true,
        },
      });

      // Update product stock
      for (const item of createOrderInput.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear user's cart if they are logged in
      if (userId) {
        await prisma.cartItem.deleteMany({
          where: { userId },
        });
      }

      return newOrder;
    });

    return order;
  }

  async findAll(status?: OrderStatus, userId?: string) {
    const where: any = {};
    
    if (status) where.status = status;
    if (userId) where.userId = userId;

    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

    return order;
  }

  async updateStatus(updateOrderStatusInput: UpdateOrderStatusInput) {
    await this.findOne(updateOrderStatusInput.orderId);

    return this.prisma.order.update({
      where: { id: updateOrderStatusInput.orderId },
      data: { status: updateOrderStatusInput.status },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async getOrderStats() {
    const [total, pending, processing, shipped, delivered, cancelled] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
      this.prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    const totalRevenue = await this.prisma.order.aggregate({
      where: { status: { in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED] } },
      _sum: { total: true },
    });

    return {
      total,
      pending,
      processing,
      shipped,
      delivered,
      cancelled,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  }
}
