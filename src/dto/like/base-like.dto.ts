import { ApiProperty } from '@nestjs/swagger';
import { BasePilot } from '../pilot/base-pilot.dto';
import { BasePost } from '../post/base-post.dto';

export class BaseLike {
  @ApiProperty()
  id: number;

  @ApiProperty()
  post_id: string;

  @ApiProperty()
  pilot: BasePilot;

  @ApiProperty()
  post: BasePost;
}
