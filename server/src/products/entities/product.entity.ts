import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class CategoryCount {
  @Field(() => Int)
  products: number;
}

@ObjectType()
export class Category {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  nameEn?: string;

  @Field({ nullable: true })
  nameAr?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => CategoryCount, { nullable: true })
  _count?: CategoryCount;
}

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  nameEn?: string;

  @Field({ nullable: true })
  nameAr?: string;

  @Field(() => Float)
  price: number;

  @Field()
  description: string;

  @Field({ nullable: true })
  descriptionEn?: string;

  @Field({ nullable: true })
  descriptionAr?: string;

  @Field()
  image: string;

  @Field(() => [String])
  images: string[];

  @Field(() => Int)
  stock: number;

  @Field()
  featured: boolean;

  @Field()
  active: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field({ nullable: true })
  categoryId?: string;
}
