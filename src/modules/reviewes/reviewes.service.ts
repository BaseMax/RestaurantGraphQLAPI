import { Inject, Injectable } from '@nestjs/common';
import { Collection, Db } from 'mongodb';
import { mapOID, objectIdOrThrow } from 'src/utils';
import { Pagination } from 'src/utils/pagination.input';
import { UserAuth } from '../auth/user-data.decorator';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { CreateReviewInput } from './dto/create-review.input';
import { Review } from './review.model';

@Injectable()
export class ReviewesService {
  private collection: Collection<Omit<Review, 'user' | 'id'>>;
  constructor(@Inject('DATABASE_CONNECTION') db: Db, private restaurantsService: RestaurantsService) {
    this.collection = db.collection('reviews');
  }

  async createReview(user: UserAuth, input: CreateReviewInput) {
    await this.restaurantsService.findByIdOrThrow(input.restaurantId)
    const insertData = { ...input, userId: user.id };
    const { value } = await this.collection.findOneAndReplace({ restaurantId: input.restaurantId, userId: user.id }, insertData, { upsert: true, returnDocument: "after" });
    return mapOID(value!);
  }
  async reviews(restaurantId: string, pagination: Pagination) {
    await this.restaurantsService.findByIdOrThrow(restaurantId)
    return (
      this.collection.find({ restaurantId }, pagination)
        .toArray()
        .then(e => e.map(mapOID))
    )
  }

}
