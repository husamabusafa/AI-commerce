import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartInput } from './dto/add-to-cart.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: string, addToCartInput: AddToCartInput) {
    // Check if product exists and has enough stock
    const product = await this.prisma.product.findUnique({
      where: { id: addToCartInput.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < addToCartInput.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    // Check if item already exists in cart
    const existingCartItem = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: addToCartInput.productId,
        },
      },
    });

    if (existingCartItem) {
      // Update quantity if item exists
      const newQuantity = existingCartItem.quantity + addToCartInput.quantity;
      
      if (product.stock < newQuantity) {
        throw new BadRequestException('Not enough stock available');
      }

      return this.prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              category: true,
            },
          },
          user: true,
        },
      });
    }

    // Create new cart item
    return this.prisma.cartItem.create({
      data: {
        userId,
        productId: addToCartInput.productId,
        quantity: addToCartInput.quantity,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        user: true,
      },
    });
  }

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCartItem(userId: string, updateCartItemInput: UpdateCartItemInput) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: updateCartItemInput.cartItemId },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.userId !== userId) {
      throw new BadRequestException('Unauthorized to update this cart item');
    }

    if (cartItem.product.stock < updateCartItemInput.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    return this.prisma.cartItem.update({
      where: { id: updateCartItemInput.cartItemId },
      data: { quantity: updateCartItemInput.quantity },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        user: true,
      },
    });
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.userId !== userId) {
      throw new BadRequestException('Unauthorized to remove this cart item');
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItemId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        user: true,
      },
    });
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });
    
    return { success: true, message: 'Cart cleared successfully' };
  }

  async getCartTotal(userId: string) {
    const cartItems = await this.getCart(userId);
    
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      total,
      itemCount,
      items: cartItems,
    };
  }
}
