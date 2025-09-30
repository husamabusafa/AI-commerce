import { ObjectType, Field, ID, Float, Int, registerEnumType } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field()
  createdAt: Date;

  @Field(() => Product)
  product: Product;

  @Field()
  productId: string;
}

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  orderNumber: string;

  @Field(() => Float)
  total: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field()
  customerName: string;

  @Field()
  customerEmail: string;

  @Field()
  shippingAddress: string;

  @Field({ nullable: true })
  phoneNumber?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => [OrderItem])
  items: OrderItem[];
}
