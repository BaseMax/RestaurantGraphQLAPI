import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';
import { Pagination } from 'src/utils/pagination.input';

@InputType()
export class NearByInput {
  @Min(0)
  @Field()
  radius: number;

  @Field()
  @Min(-180)
  @Max(180)
  longitude: number;

  @Field()
  @Min(-90)
  @Max(90)
  latitude: number;
}

@InputType()
export class SearchRestaurantsInput extends Pagination {
  @Field({ nullable: true })
  nearBy?: NearByInput;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  cuisine?: string;

  @Field({ nullable: true })
  city?: string;

  @IsOptional()
  @Min(0)
  @Field({ nullable: true })
  minPrice?: number;

  @IsOptional()
  @Min(0)
  @Field({ nullable: true })
  maxPrice?: number;
}
