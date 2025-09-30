import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  nameEn?: string;

  @Field(() => Role)
  role: Role;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  joinedAt: Date;

  @Field()
  updatedAt: Date;

  // Password is not exposed in GraphQL
}
