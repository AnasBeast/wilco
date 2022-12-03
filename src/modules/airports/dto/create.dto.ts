import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateAirportDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Airport of NY' })
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({ example: '00AK' })
  readonly icao: string
}
