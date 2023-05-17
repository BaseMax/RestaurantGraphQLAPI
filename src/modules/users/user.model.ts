import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  role: Role;

  email: string;
  password: string;
}

export enum Role {
  user,
  admin,
  superadmin,
}

registerEnumType(Role, { name: 'Role' });
