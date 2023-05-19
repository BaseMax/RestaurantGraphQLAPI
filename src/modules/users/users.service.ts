import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Collection, Db } from 'mongodb';
import { mapOID, mapOIDIfNotNull, objectIdOrThrow } from 'src/utils';
import { UserAuth } from '../auth/user-data.decorator';
import { RegisterUserInput } from './dto/register.input';
import { Role, User } from './user.model';

interface DbUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}

@Injectable()
export class UsersService {
  getAll(): Promise<User[]> {
    return this.collection.find().toArray().then(e => e.map(mapOID));
  }
  async changeRole( role: Role, id: string): Promise<User> {
    const userExists = await this.getUserById(id);
    if (!userExists)
      throw new NotFoundException("user not found");
    const { value } = await this.collection.findOneAndUpdate({ _id: objectIdOrThrow(id) }, { $set: { role } }, { returnDocument: "after" })
    return mapOID(value!)
  }
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
      role: Role.user,
    });
    return mapOID(user);
  }
  private async createUser(insertInput: DbUser) {
    const { insertedId } = await this.collection.insertOne(insertInput);
    const user = { _id: insertedId, ...insertInput };
    return user;
  }
}
