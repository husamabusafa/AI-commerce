import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @IsString()
  productId: string;

  @Field(() => Int, { defaultValue: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
