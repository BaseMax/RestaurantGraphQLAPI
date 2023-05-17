
import { Field, ID, InputType } from '@nestjs/graphql';


@InputType()
export class CreateFoodInput {

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field(() => ID)
  restaurantId: string;
}
