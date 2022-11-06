import { ApiProperty } from '@nestjs/swagger';

export class BaseCertificate {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name?: string;
}
