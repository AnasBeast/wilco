import { Types } from 'mongoose';

export class AirportEntity {
  _id: Types.ObjectId;
  name: string;
  icao: string;
  createdAt?: Date;
  updatedAt?: Date;
}
