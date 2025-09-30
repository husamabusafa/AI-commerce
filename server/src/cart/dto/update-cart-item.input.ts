import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class UpdateCartItemInput {
  @Field(() => ID)
  @IsString()
  cartItemId: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;
}
