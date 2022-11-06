import { ApiProperty } from '@nestjs/swagger';

export class BaseDevice {
  @ApiProperty()
  id: number;

  @ApiProperty()
  token?: string;
}
