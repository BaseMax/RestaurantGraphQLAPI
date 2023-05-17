import { Module } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { FoodsResolver } from './foods.resolver';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { DbModule } from '../db/db.module';

@Module({
  imports: [RestaurantsModule, DbModule],
  providers: [FoodsService, FoodsResolver]
})
export class FoodsModule { }
