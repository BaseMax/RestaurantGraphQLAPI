import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;


  @Field()
  name: string;

  email: string;
  password: string;
}
