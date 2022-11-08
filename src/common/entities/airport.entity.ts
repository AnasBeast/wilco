import { ObjectId } from 'mongoose';

export class AirportEntity {
  id?: ObjectId;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
