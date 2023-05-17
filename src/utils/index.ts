import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export function objectIdOrThrow(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new BadRequestException('invalid object id');
  }
  return new ObjectId(id);
}
export function mapOIDIfNotNull<T extends { _id: ObjectId }>(t: T | null) {
  if (t) {
    return mapOID(t);
  }
  return null;
}
export function mapOID<T extends { _id: ObjectId }>(t: T) {
  return {
    ...t,
    id: t._id.toString(),
  };
}
