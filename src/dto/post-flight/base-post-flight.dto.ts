import { ApiProperty } from '@nestjs/swagger';
import { BasePilot } from '../pilot/base-pilot.dto';
import { BasePost } from '../post/base-post.dto';

export class BasePostFlight {
  @ApiProperty()
  id: string;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  departure_time: string;

  @ApiProperty()
  arrival_time: string;

  @ApiProperty()
  max_speed: number;

  @ApiProperty()
  max_altitude: number;

  @ApiProperty()
  distance: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  aircraft: 'AirCraft'; // TODO by Awais

  @ApiProperty()
  track_url: string;
}
