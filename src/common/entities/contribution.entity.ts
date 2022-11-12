import { ObjectId } from 'mongoose';

export class ContributionEntity {
  id?: ObjectId;
  name: string;
  number_of_posts: number;
  createdAt?: Date;
  updatedAt?: Date;
}
