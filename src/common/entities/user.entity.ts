import { AirportEntity } from 'src/common/entities/airport.entity';
import { RoleEntity } from './role.entity';
import { Date, ObjectId, Types } from 'mongoose';
import { AirCraftEntity } from './airCraft.entity';
import { CommunityEntity } from './community.entity';

export class UserEntity {
  _id: Types.ObjectId;
  first_name: string;
  last_name: string;
  banner?: string;
  roles: RoleEntity[];
  home_airport?: AirportEntity;
  aircrafts?: AirCraftEntity[];
  primary_aircraft?: AirCraftEntity;
  communities?: CommunityEntity[];
  total_hours?: number;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  profile_picture_link?: string;
  profile_picture_key?: string;
}
