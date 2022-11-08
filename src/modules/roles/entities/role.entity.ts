import { Date, ObjectId } from 'mongoose';

export class RoleEntity {
  id?: ObjectId;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
