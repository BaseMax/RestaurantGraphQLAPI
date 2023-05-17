import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { mapOID, objectIdOrThrow } from 'src/utils';
import { Pagination } from 'src/utils/pagination.input';
import { UserAuth } from '../auth/user-data.decorator';
import { Restaurant } from '../restaurants/restaurant.model';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Role } from '../users/user.model';
import { CreateFoodInput } from './dto/create-food.input';
import { UpdateFoodInput } from './dto/update-food.input';
import { Food } from './foods.model';

@Injectable()
export class FoodsService {
  async findById(id: string) {
    const doc = await this.collection.findOne({ _id: objectIdOrThrow(id) });
    if (!doc) throw new NotFoundException('restaurant not found');
    return mapOID(doc);
  }
  async delete(user: UserAuth, id: string) {
    await this.findAndValidatePermissions(id, user);
    await this.collection.deleteOne({ _id: objectIdOrThrow(id) });
  }
  private collection: Collection<Omit<Food, 'id'>>;
  constructor(@Inject('DATABASE_CONNECTION') db: Db, private restaurantsService: RestaurantsService) {
    this.collection = db.collection('foods');
  }
  private async findAndValidatePermissions(
    id: string,
    user: UserAuth,
  ) {
    const doc = await this.findById(id);
    if (user.role < Role.superadmin && user.id !== doc.creatorId) {
      throw new ForbiddenException('could not modify');
    }
  }

  async create(user: UserAuth, input: CreateFoodInput) {
    if (!this.restaurantsService.findByIdOrThrow(input.restaurantId)) {
      throw new NotFoundException("restaurant not found");
    }
    const insertData = { ...input, creatorId: user.id };
    const { insertedId } = await this.collection.insertOne(insertData);
    const output = { ...insertData, _id: insertedId };
    return mapOID(output);
  }
  async update(user: UserAuth, input: UpdateFoodInput) {
    const { id, ...data } = input;
    await this.findAndValidatePermissions(id, user);
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
  async restaurantsFoods(restaurantId: string, pagination: Pagination) {
    await this.restaurantsService.findByIdOrThrow(restaurantId)
    return (
      this.collection.find({ restaurantId }, pagination)
        .toArray()
        .then(e => e.map(mapOID))
    )
  }


}
