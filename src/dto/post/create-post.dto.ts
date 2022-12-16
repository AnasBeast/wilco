import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, IsPositive, IsString, Length, ValidateNested } from "class-validator";

type Visibility = "public" | "only_me";

export class FlightDTO {
  @ApiProperty()
  @Length(4, 4)
  from: string;

  @ApiProperty()
  @Length(4, 4)
  to: string;

  @ApiProperty()
  @IsDate()
  departure_time: string;

  @ApiProperty()
  @IsDate()
  arrival_time: string;

  @ApiProperty()
  aircraft_id: number;

  @ApiProperty()
  @IsPositive()
  max_speed: number;
  
  @ApiProperty()
  @IsPositive()
  max_altitude: number;

  @ApiProperty()
  @IsPositive()
  distance: number;

  @ApiProperty()
  track: string;
}

class PostDTO {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  text: string;

  @ApiProperty()
  visibility: Visibility;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ each: true })
  community_tags: string[];

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ each: true })
  airports: string[];

  @ApiProperty()
  mentions_ids: number[];

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ each: true })
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
