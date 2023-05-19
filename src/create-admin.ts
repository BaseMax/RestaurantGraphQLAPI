import {createInterface} from "readline/promises"

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { Role } from "./modules/users/user.model";

async function bootstrap() {
  const rl = createInterface(process.stdin, process.stdout)
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const usersService = app.get(UsersService)

  const { id } = await usersService.register({
    email: await rl.question('email address : '),
    name: await rl.question('name :'),
    password: await rl.question("password :")
  });
  await usersService.changeRole(Role.superadmin, id)
  console.log("end")
  process.exit(0)
}
bootstrap();
