import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateCategoryInput {
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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
