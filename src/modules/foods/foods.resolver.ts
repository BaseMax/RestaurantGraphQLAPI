import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pagination } from 'src/utils/pagination.input';
import { AuthGuard } from '../auth/auth.guard';
import { MinRole } from '../auth/min-role.decorator';
import { UserAuth, UserData } from '../auth/user-data.decorator';
import { Role } from '../users/user.model';
import { CreateFoodInput } from './dto/create-food.input';
import { UpdateFoodInput } from './dto/update-food.input';
import { Food } from './foods.model';
import { FoodsService } from './foods.service';

@Resolver(() => Food)
export class FoodsResolver {

  constructor(private service: FoodsService) { }

  @Query(() => Food)
  async food(@Args('id', { type: () => ID }) id: string) {
    return await this.service.findById(id);
  }

  @Query(() => [Food])
  async foods(@Args('restaurantId', { type: () => ID }) id: string, @Args('pagination') pagination: Pagination) {
    return await this.service.restaurantsFoods(id, pagination);
  }


  @MinRole(Role.admin)
  @UseGuards(AuthGuard)
  @Mutation(() => Food)
  async createFood(
    @UserData() user: UserAuth,
    @Args('input') input: CreateFoodInput,
  ) {
    return await this.service.create(user, input);
  }

  @MinRole(Role.admin)
  @UseGuards(AuthGuard)
  @Mutation(() => Food)
  async updateFood(
    @UserData() user: UserAuth,
    @Args('input') input: UpdateFoodInput,
  ) {
    return await this.service.update(user, input);
  }

  @UseGuards(AuthGuard)
  @MinRole(Role.admin)
  @Mutation(() => Boolean)
  async deleteFood(@UserData() user: UserAuth, @Args('id') id: string) {
    await this.service.delete(user, id);
    return true;
  }


}
