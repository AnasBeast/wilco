import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBase64, IsNotEmpty, IsNotEmptyObject, IsOptional, Validate, ValidateNested } from 'class-validator';
import { IsValidTailNumber } from './validate-tail-number';

export class AircraftObjectDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 'make and model example' })
  readonly make_and_model: string;

  @Validate(IsValidTailNumber)
  @IsNotEmpty()
  @ApiProperty({ example: 'tail number example' })
  readonly tail_number: string;

  @IsOptional()
  @IsBase64()
  readonly base_64_picture: string;
}

export class CreateAirCraftDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AircraftObjectDTO)
  readonly aircraft: AircraftObjectDTO
}

export class UpdateAircraftObjectDTO {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'make and model example' })
  make_and_model: string;

  @IsOptional()
  @IsNotEmpty()
  @Validate(IsValidTailNumber)
  @ApiProperty({ example: 'tail number example' })
  tail_number: string;
}

export class UpdateAirCraftDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateAircraftObjectDTO)
  readonly aircraft: UpdateAircraftObjectDTO
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
