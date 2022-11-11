import { AirportEntity } from 'src/common/entities/airport.entity';
import { ObjectId } from 'mongoose';
import { AirCraftEntity } from './airCraft.entity';

export class FlightEntity {
  id?: ObjectId;
  from: string;
  to: string;
  departure_date: Date;
  arrival_date: Date;
  distance: number;
  airCraft?: AirCraftEntity;
  airportPath: AirportEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
