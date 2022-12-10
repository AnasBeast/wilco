import { AirportEntity } from 'src/common/entities/airport.entity';
import { RoleEntity } from './role.entity';
import { Date, ObjectId, Types } from 'mongoose';
import { AirCraftEntity } from './airCraft.entity';
import { CommunityEntity } from './community.entity';

export class PilotEntity {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  primary_aircraft?: AirCraftEntity;
  total_hours?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
