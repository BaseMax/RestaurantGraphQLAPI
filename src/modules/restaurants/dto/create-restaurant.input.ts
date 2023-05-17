import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, Max, Min } from 'class-validator';
import { Weekday } from '../restaurant.model';

@InputType()
export class ContactInput {
  @IsEmail()
  @Field({ nullable: true })
  email?: string;

  @IsPhoneNumber()
  @Field({ nullable: true })
  phone?: string;
}
@InputType()
export class LocationInput {
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
export class OpeningHourInput {
  @Field(() => Weekday)
  day: Weekday;

  @Field()
  hours: string;
}

@InputType()
export class CreateRestaurantInput {
  @Field()
  name: string;

  @Field()
  location: LocationInput;

  @Field()
  address: string;

  @Field()
  rating: number;

  @Field()
  cuisine: string;

  @Field({ nullable: true })
  contact?: ContactInput;

  @Field(() => [OpeningHourInput], { nullable: true })
  openingHours?: OpeningHourInput[];
}
