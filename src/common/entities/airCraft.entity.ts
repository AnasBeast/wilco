import { Date, ObjectId } from 'mongoose';

export class AirCraftEntity {
  _id: ObjectId;
  make_and_model: string;
  tail_number: string;
  aicraft_picture: string;
  aircraft_picture_key: string;
  createdAt?: Date;
  updatedAt?: Date;
}
