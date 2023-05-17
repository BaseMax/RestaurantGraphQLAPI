
import { Field, ID, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class Food {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  restaurantId: string;
  creatorId: string;
}
