import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class CartItem {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @Field(() => Product)
  product: Product;

  @Field()
  userId: string;

  @Field()
  productId: string;
}
