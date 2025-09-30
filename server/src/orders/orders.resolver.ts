import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role, OrderStatus } from '@prisma/client';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard)
  createOrder(
    @CurrentUser() user: User,
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
  ) {
    return this.ordersService.create(user.id, createOrderInput);
  }

  @Mutation(() => Order, { name: 'createGuestOrder' })
  createGuestOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.ordersService.create(null, createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAllOrders(
    @Args('status', { type: () => OrderStatus, nullable: true }) status?: OrderStatus,
  ) {
    return this.ordersService.findAll(status);
  }

  @Query(() => [Order], { name: 'myOrders' })
  @UseGuards(JwtAuthGuard)
  findMyOrders(
    @CurrentUser() user: User,
    @Args('status', { type: () => OrderStatus, nullable: true }) status?: OrderStatus,
  ) {
    return this.ordersService.findAll(status, user.id);
  }

  @Query(() => Order, { name: 'order' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.ordersService.findOne(id);
  }

  @Query(() => Order, { name: 'orderByNumber' })
  findByOrderNumber(@Args('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateOrderStatus(@Args('updateOrderStatusInput') updateOrderStatusInput: UpdateOrderStatusInput) {
    return this.ordersService.updateStatus(updateOrderStatusInput);
  }
}
