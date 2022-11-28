import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from "mongoose";

export class CreateAirCraftDto {
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ example: 'pilot id' })
  readonly pilot_id: Types.ObjectId

  @IsNotEmpty()
  @ApiProperty({ example: 'make and model example' })
  readonly make_and_model: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'tail number example' })
  readonly tail_number: string;
}

export class UpdateAirCraftDto {
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'make and model example' })
  readonly make_and_model: string;

  @IsOptional()
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
