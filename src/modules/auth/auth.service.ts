import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserInput } from '../users/dto/register.input';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login.input';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwt: JwtService) { }
  async register(input: RegisterUserInput) {
    const user = await this.usersService.register(input);
    const token = this.getToken(user);
    return {
      user,
      token,
    };
  }

  async login(input: LoginUserInput) {
    const user = await this.usersService.getUserByEmail(input.email);
    if (!user || !(await argon2.verify(user.password, input.password))) {
      throw new BadRequestException('invalid email or password');
    }
    return {
      user,
      token: this.getToken(user),
    };
  }
  getToken(user: User) {
    const token = this.jwt.sign({
      email: user.email,
      userId: user.id,
    });
    return token;
  }
}
