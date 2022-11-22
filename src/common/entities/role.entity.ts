import { Date, Types } from 'mongoose';

export class RoleEntity {
  _id?: Types.ObjectId;
  name: string;
  custom: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
