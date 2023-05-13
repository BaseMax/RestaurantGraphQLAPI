import { ObjectId } from 'mongodb';
export interface DbUser {
  name: string;
  email: string;
  password: string;
}
