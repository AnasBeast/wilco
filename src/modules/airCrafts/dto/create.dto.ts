import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateAirCraftDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'make and model example' })
  readonly make_and_model: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'tail number example' })
  readonly tail_number: string;
}

export class CreateAirCraftPictureDto extends CreateAirCraftDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'mpicture' })
  readonly aicraft_picture: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'picture key' })
  readonly aircraft_picture_key: string;
}
