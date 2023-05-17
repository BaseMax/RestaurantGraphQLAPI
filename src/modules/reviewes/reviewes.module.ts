import { Module } from '@nestjs/common';
import { ReviewesService } from './reviewes.service';
import { ReviewesResolver } from './reviewes.resolver';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { DbModule } from '../db/db.module';


@Module({
  imports: [RestaurantsModule, DbModule],
  providers: [ReviewesService, ReviewesResolver]
})
export class ReviewesModule { }
