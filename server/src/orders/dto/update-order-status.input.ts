import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

@InputType()
export class UpdateOrderStatusInput {
  @Field(() => ID)
  @IsString()
  orderId: string;

  @Field(() => OrderStatus)
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
