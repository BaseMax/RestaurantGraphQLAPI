import { UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { MinRole } from '../auth/min-role.decorator';
import { UserAuth, UserData } from '../auth/user-data.decorator';
import { Role } from '../users/user.model';
import {
  CreateRestaurantInput,
  LocationInput,
} from './dto/create-restaurant.input';
import { SearchRestaurantsInput } from './dto/search.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { Restaurant } from './restaurant.model';
import { RestaurantsService } from './restaurants.service';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private service: RestaurantsService) {}

  @Query(() => [Restaurant])
  async restaurants(@Args('query') query: SearchRestaurantsInput) {
    // todo: complete
  }
  @Query(() => Restaurant)
  async restaurant(@Args('id', { type: () => ID }) id: string) {
    return await this.service.findByIdOrThrow(id);
  }

  @MinRole(Role.admin)
  @UseGuards(AuthGuard)
  @Mutation(() => Restaurant)
  async createRestaurant(
    @UserData() user: UserAuth,
    @Args('input') input: CreateRestaurantInput,
  ) {
    return await this.service.create(user, input);
  }

  @MinRole(Role.admin)
  @UseGuards(AuthGuard)
  @Mutation(() => Restaurant)
  async updateRestaurant(
    @UserData() user: UserAuth,
    @Args('input') input: UpdateRestaurantInput,
  ) {
    return await this.service.update(user, input);
  }

  @UseGuards(AuthGuard)
  @MinRole(Role.admin)
  @Mutation(() => Boolean)
  async deleteRestaurant(@UserData() user: UserAuth, @Args('id') id: string) {
    await this.service.delete(user, id);
    return true;
  }

  @ResolveField(Number, {})
  distance(
    @Parent() parent: Omit<Restaurant, 'distance'>,
    @Args('location') location: LocationInput,
  ) {
    return this.service.calculateDistance(parent, location);
  }
}
