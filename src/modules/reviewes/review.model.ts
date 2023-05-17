import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../users/user.model';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field()
  rating: number;

  @Field()
  comment: string;

  @Field()
  user: User;

  userId: string;
  restaurantId: string;
}
