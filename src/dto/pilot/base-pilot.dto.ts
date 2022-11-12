import { ApiProperty } from '@nestjs/swagger';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';
import { Role } from 'src/database/mongo/models/role.model';
import { Certificate } from 'src/schemas/certificate.schema';
import { PostFlight } from 'src/schemas/post-flight.schema';

export class BasePilot {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  primary_aircraft_id: number;

  @ApiProperty()
  profile_picture_url: string;

  @ApiProperty()
  latest_flights: PostFlight;

  @ApiProperty()
  aircrafts: AirCraft;

  @ApiProperty()
  certificates: Certificate;

  @ApiProperty()
  ratings: string; // TODO by AWAIS

  @ApiProperty()
  community_tags: string;

  @ApiProperty()
  roles: Role; // TODO by AWAIS
}
