import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '../auth/auth.guard';
import { MinRole } from '../auth/min-role.decorator';
import { UserAuth, UserData } from '../auth/user-data.decorator';
import { Role, User } from './user.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private service: UsersService) { }
  @MinRole(Role.superadmin)
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async changeRole(
    @UserData() user: UserAuth,
    @Args('newRole', { type: () => Role }) role: Role,
    @Args('userId', { type: () => String }) id: string,

  ) {
    return await this.service.changeRole(user, role, id);
  }
  @MinRole(Role.superadmin)
  @UseGuards(AuthGuard)
  @Query(() => [User])
  async getAllUsers() {
    return await this.service.getAll();
  }
}
