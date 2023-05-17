import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  phone?: string;
}

@ObjectType()
export class OpeningHour {
  @Field(() => Weekday)
  day: Weekday;

  @Field()
  hours: string;
}

@ObjectType()
export class Location {
  @Field()
  longitude: number;

  @Field()
  latitude: number;
}
@ObjectType()
export class Restaurant {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;

  @Field()
  location: Location;

  @Field()
  address: string;

  @Field(() => Int)
  distance: number;

  @Field()
  rating: number;

  @Field()
  cuisine: string;

  @Field({ nullable: true })
  contact?: Contact;

  @Field(() => [OpeningHour], { nullable: true })
  openingHours?: OpeningHour[];

  creatorId: string;
}
export enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

registerEnumType(Weekday, {
  name: 'Weekday',
});
