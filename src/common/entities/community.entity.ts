import { ObjectId } from 'mongoose';

export class CommunityEntity {
  id?: ObjectId;
  name: string;
  pilot_number: number;
  createdAt?: Date;
  updatedAt?: Date;
}
