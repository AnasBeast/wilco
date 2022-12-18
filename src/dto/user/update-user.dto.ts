import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsBase64, IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { Types } from "mongoose";

@Exclude()
export class PilotPatchDto {
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'James' })
  readonly first_name?: string;
  
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lebron' })
  readonly last_name?: string;
  
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  readonly description?: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly home_airport?: string;

  @Expose()
  @IsOptional()
  @IsNumberString()
  readonly total_hours?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  readonly primary_aircraft_id?: number;

  @Expose()
  @IsOptional()
  @IsBase64()
  readonly profile_picture_base64?: string;

  @Expose()
  @IsOptional()
  @IsNumber(undefined, { each: true })
  readonly certificate_ids?: number[]

  @Expose()
  @IsOptional()
  @IsNumber(undefined, { each: true })
  readonly rating_ids?: number[]

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  readonly communities_tags?: string[]

  @Expose()
  @IsOptional()
  @IsNumber(undefined, { each: true })
  @ApiProperty({ example: 'pilot role(s) id(s)' })
  readonly roles?: number[];

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ example: 'role(s) seperated by commas' })
  readonly custom_roles?: string[];
}

export class EditPilotDto {
  @ValidateNested()
  @Type(() => PilotPatchDto)
  readonly pilot: PilotPatchDto
}