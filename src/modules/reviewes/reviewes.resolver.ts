import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Pagination } from 'src/utils/pagination.input';
import { AuthGuard } from '../auth/auth.guard';
import { UserAuth, UserData } from '../auth/user-data.decorator';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { CreateReviewInput } from './dto/create-review.input';
import { Review } from './review.model';
import { ReviewesService } from './reviewes.service';

@Resolver(() => Review)
export class ReviewesResolver {
  constructor(private service: ReviewesService, private users: UsersService) { }
  @Query(() => [Review])
  async reviews(@Args('restaurantId', { type: () => ID }) restaurantId: string, @Args('pagination') pagination: Pagination) {
    return this.service.reviews(restaurantId, pagination);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Review)
  async createReview(@UserData() user: UserAuth, @Args('input') input: CreateReviewInput) {
    return await this.service.createReview(user, input);
  }

  @ResolveField(() => User)
  async user(@Parent() review: Omit<Review, 'user'>) {
    return await this.users.getUserById(review.userId)
  }

}
