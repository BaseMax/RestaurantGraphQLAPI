import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsResolver } from './restaurants.resolver';
import { DbModule } from '../db/db.module';

@Module({
  providers: [RestaurantsService, RestaurantsResolver],
  exports: [RestaurantsService],
  imports: [DbModule],
})
export class RestaurantsModule { }
