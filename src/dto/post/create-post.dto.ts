import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

type Visibility = "public" | "only_me";

class FlightDTO {
  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  departure_time: string;

  @ApiProperty()
  arrival_time: string;

  @ApiProperty()
  aircraft_id: number;

  @ApiProperty()
  max_speed: number;
  
  @ApiProperty()
  max_altitude: number;

  @ApiProperty()
  distance: number;

  @ApiProperty()
  track: string;
}

class PostDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  visibility: Visibility;

  @ApiProperty()
  community_tags: string[];

  @ApiProperty()
  airports: string[];

  @ApiProperty()
  mentions_ids: number[];

  @ApiProperty()
  hashtags: string[]

  @ApiProperty()
  @ValidateNested()
  @Type(() => FlightDTO)
  flight: FlightDTO;

  @ApiProperty()
  photos: string[];
}

export class CreatePostDTO {
  @ValidateNested()
  @Type(() => PostDTO)
  post: PostDTO;
}
