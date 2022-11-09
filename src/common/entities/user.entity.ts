import { AirportEntity } from 'src/common/entities/airport.entity';
import { RoleEntity } from './role.entity';
import { Date } from 'mongoose';

export class UserEntity {
  email: string;
  password: string;
  role: RoleEntity;
  home_airport?: AirportEntity;
  cometchat_auth_token?: string;
  first_name: string;
  last_name: string;
  description?: string;
  primary_aircraft_id?: string;
  total_hours?: string;
  createdAt?: Date;
  updatedAt?: Date;
  profile_picture_link: string;
  profile_picture_key: string;
}
