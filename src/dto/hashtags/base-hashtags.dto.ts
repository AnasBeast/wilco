import { ApiProperty } from '@nestjs/swagger';

export class BaseHashtags {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text?: string;
}
