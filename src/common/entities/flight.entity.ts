import { ApiProperty } from '@nestjs/swagger';
import { AirportEntity } from 'src/common/entities/airport.entity';
import { AirCraftEntity } from './airCraft.entity';

export class PetitFlight {
  @ApiProperty()
  external_id: string;
  @ApiProperty()
  from: string;
  @ApiProperty()
  to: string;
  @ApiProperty()
  departure_date: Date;
  @ApiProperty()
  arrival_date: Date;
  @ApiProperty()
  max_speed: number;
  @ApiProperty()
  max_altitude: number;
  @ApiProperty()
  distance: number;
}

export class FlightEntity {
  @ApiProperty()
  response: PetitFlight
  
}