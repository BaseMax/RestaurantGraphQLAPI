import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { Max, Min } from "class-validator";

@InputType()
export class CreateReviewInput {
  @Field(() => ID)
  restaurantId: string;

  @Field()
  comment: string;

  @Min(0)
  @Max(5)
  @Field(() => Int)
  rating: number;
}
