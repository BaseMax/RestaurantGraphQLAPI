import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getDistance } from 'geolib';
import { Collection, Db, WithId } from 'mongodb';
import { mapOID, objectIdOrThrow } from 'src/utils';
import { UserAuth } from '../auth/user-data.decorator';
import { Role } from '../users/user.model';
import {
  CreateRestaurantInput,
  LocationInput,
} from './dto/create-restaurant.input';
import { SearchRestaurantsInput } from './dto/search.input';
import { UpdateRestaurantInput } from './dto/update-restaurant.input';
import { Location, Restaurant } from './restaurant.model';

type GeoPoint = {
  type: "Point";
  coordinates: [number, number];
};

@Injectable()
export class RestaurantsService {
  async findByIdOrThrow(id: string) {
    const doc = await this.collection.findOne({ _id: objectIdOrThrow(id) });
    if (!doc) throw new NotFoundException('restaurant not found');
    return mapOID(this.mapDocumentFromGeoJson(doc));
  }
  async delete(user: UserAuth, id: string) {
    await this.findAndValidatePermissions(id, user);
    await this.collection.deleteOne({ _id: objectIdOrThrow(id) });
  }
  private collection: Collection<Omit<Restaurant, 'distance' | 'id' | 'location'> & { location: GeoPoint }>;
  constructor(@Inject('DATABASE_CONNECTION') db: Db) {
    this.collection = db.collection('restaurants');
  }
  private async findAndValidatePermissions(
    id: string,
    user: UserAuth,
  ) {
    const doc = await this.findByIdOrThrow(id);
    if (user.role < Role.superadmin && user.id !== doc.creatorId) {
      throw new ForbiddenException('could not modify');
    }
  }

  async search(input: SearchRestaurantsInput) { }
  async create(user: UserAuth, input: CreateRestaurantInput) {
    const insertData = this.mapDocumentIntoGeoJson({ ...input, creatorId: user.id });
    const { insertedId } = await this.collection.insertOne(insertData);
    const output = { ...insertData, _id: insertedId };
    return mapOID(this.mapDocumentFromGeoJson(output));
  }
  async update(user: UserAuth, input: UpdateRestaurantInput) {
    const { id, ...data } = input;
    await this.findAndValidatePermissions(id, user);
    const { value } = await this.collection.findOneAndUpdate(
      { _id: objectIdOrThrow(id) },
      {
        $set: data.location ? this.mapDocumentIntoGeoJson(data as any) : data,
      },
      {
        returnDocument: 'after',
      },
    );

    return mapOID(this.mapDocumentFromGeoJson(value!));
  }
  mapDocumentIntoGeoJson<T extends { location: Location }>(restaurant: T) {
    return {
      ...restaurant,
      location: this.toGeoJson(restaurant.location)
    }
  }
  mapDocumentFromGeoJson<T extends { location: GeoPoint }>(restaurant: T) {
    return {
      ...restaurant,
      location: this.fromGeoJson(restaurant.location)
    }
  }
  fromGeoJson(location: { type: "Point", coordinates: [number, number] }) {

    return {
      longitude: location.coordinates[0],
      latitude: location.coordinates[1],
    }
  }
  toGeoJson(location: Location) {
    return {
      type: "Point" as const,
      coordinates: [location.longitude, location.latitude] as [number, number]
    }
  }
  calculateDistance(
    restaurant: Omit<Restaurant, 'distance'>,
    location: LocationInput,
  ) {
    return getDistance(restaurant.location, location);
  }
}
