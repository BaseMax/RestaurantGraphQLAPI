import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getDistance } from 'geolib';
import { Collection, Db } from 'mongodb';
import { mapOID, objectIdOrThrow } from 'src/utils';
import { UserAuth } from '../auth/user-data.decorator';
import { Role } from '../users/user.model';
import {
  CreateRestaurantInput,
  LocationInput,
} from './dto/create-restaurant.input';
import { SearchRestaurantsInput } from './dto/search.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { Restaurant } from './restaurant.model';

@Injectable()
export class RestaurantsService {
  async findById(id: string) {
    const doc = await this.collection.findOne({ _id: objectIdOrThrow(id) });
    if (!doc) throw new NotFoundException('restaurant not found');
    return mapOID(doc);
  }
  async delete(user: UserAuth, id: string) {
    await this.findRestaurantAndValidatePermissions(id, user);
    await this.collection.deleteOne({ _id: objectIdOrThrow(id) });
  }
  private collection: Collection<Omit<Restaurant, 'distance' | 'id'>>;
  constructor(@Inject('DATABASE_CONNECTION') db: Db) {
    this.collection = db.collection('restaurants');
  }
  private async findRestaurantAndValidatePermissions(
    id: string,
    user: UserAuth,
  ) {
    const doc = await this.findById(id);
    if (user.role < Role.superadmin && user.id !== doc.creatorId) {
      throw new ForbiddenException('could not modify');
    }
  }

  async search(input: SearchRestaurantsInput) {}
  async create(user: UserAuth, input: CreateRestaurantInput) {
    const insertData = { ...input, creatorId: user.id };
    const { insertedId } = await this.collection.insertOne(insertData);
    const output = { ...insertData, _id: insertedId };
    return mapOID(output);
  }
  async update(user: UserAuth, input: UpdateRestaurantInput) {
    const { id, ...data } = input;
    await this.findRestaurantAndValidatePermissions(id, user);
    const { value } = await this.collection.findOneAndUpdate(
      { _id: objectIdOrThrow(id) },
      {
        $set: data,
      },
      {
        returnDocument: 'after',
      },
    );

    return mapOID(value!);
  }

  calculateDistance(
    restaurant: Omit<Restaurant, 'distance'>,
    location: LocationInput,
  ) {
    return getDistance(restaurant.location, location);
  }
}
