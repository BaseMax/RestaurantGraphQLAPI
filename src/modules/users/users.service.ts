import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Collection, Db } from 'mongodb';
import { mapOID, mapOIDIfNotNull, objectIdOrThrow } from 'src/utils';
import { RegisterUserInput } from './dto/register.input';
import { DbUser } from './user.db-model';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private collection: Collection<DbUser>;
  constructor(@Inject('DATABASE_CONNECTION') db: Db) {
    this.collection = db.collection('users');
  }
  getUserById(id: string): Promise<User | null> {
    return this.collection
      .findOne({ _id: objectIdOrThrow(id) })
      .then(mapOIDIfNotNull);
  }
  getUserByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({ email: email }).then(mapOIDIfNotNull);
  }

  async register(input: RegisterUserInput) {
    const userExists = await this.getUserByEmail(input.email);
    if (userExists) {
      throw new BadRequestException('user exists');
    }

    const hashedPassword = await argon2.hash(input.password);
    const user = await this.createUser({
      ...input,
      password: hashedPassword,
    });
    return mapOID(user);
  }
  private async createUser(insertInput: {
    password: string;
    email: string;
    name: string;
  }) {
    const { insertedId } = await this.collection.insertOne(insertInput);
    const user = { _id: insertedId, ...insertInput };
    return user;
  }
}
