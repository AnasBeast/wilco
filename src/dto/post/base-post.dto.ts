import { ApiProperty } from '@nestjs/swagger';
import { BasePilot } from '../pilot/base-pilot.dto';
import { BasePostFlight } from '../post-flight/base-post-flight.dto';

enum Visiblity {
  public, 
  only_me
}

export class BasePost {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  edited_at: string;

  @ApiProperty()
  number_of_likes: number;

  @ApiProperty()
  number_of_comments: number;

  @ApiProperty()
  iked: boolean;

  @ApiProperty()
  visibility: Visiblity;

  @ApiProperty()
  pilot: BasePilot;

  @ApiProperty()
  flight: BasePostFlight;

  @ApiProperty()
  photo_urls: string;

  @ApiProperty()
  photo_preview_urls: string;

  @ApiProperty()
  photo_ids: string;

  @ApiProperty()
  community_tags: string;

  @ApiProperty()
  airports: string;

  @ApiProperty()
  hashtags: string;
}