import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthPayload } from './dto/auth-payload.model';
import { LoginUserInput } from './dto/login.input';
import { RegisterUserInput } from '../users/dto/register.input';
import { UserAuth, UserData } from './user-data.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private service: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => AuthPayload)
  async register(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => RegisterUserInput })
    input: RegisterUserInput,
  ) {
    const payload = await this.service.register(input);
    ctx.req.user = payload.user;
    return payload;
  }

  @Mutation(() => AuthPayload)
  async login(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => LoginUserInput })
    input: LoginUserInput,
  ) {
    const payload = await this.service.login(input);
    ctx.req.user = payload.user;
    return payload;
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async user(@UserData() userData: UserAuth) {
    return this.usersService.getUserById(userData.id);
  }
}
