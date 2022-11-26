import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAirCraftDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'make and model example' })
  readonly make_and_model: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'tail number example' })
  readonly tail_number: string;
}

export class CreateAirCraftPictureDto extends CreateAirCraftDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'mpicture' })
  readonly aicraft_picture?: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'picture key' })
  readonly aircraft_picture_key?: string;
}
