import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, Min } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameEn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nameAr?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @Field()
  @IsString()
  image: string;

  @Field(() => [String], { defaultValue: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  @Min(0)
  stock: number;

  @Field({ defaultValue: false })
  @IsOptional()
  @IsBoolean()
  featured: boolean;

  @Field({ defaultValue: true })
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @Field()
  @IsString()
  categoryId: string;
}
