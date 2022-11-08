import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateAirportDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'Airport of NY' })
  readonly name: string;
}
