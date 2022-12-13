import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, IsString } from "class-validator";
import { Types } from "mongoose";

export class EditUserDto {
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'James' })
    readonly first_name: string;
    
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'Lebron' })
    readonly last_name: string;
    
    @IsOptional()
    @IsNotEmpty()
    readonly description: string;

    @IsOptional()
    @IsNumberString()
    readonly total_hours: string;

    @IsOptional()
    @IsNumber()
    readonly primary_aircraft_id;

    @IsOptional()
    @IsNumber()
    readonly certificate_ids: number[]

    @IsOptional()
    @IsNumber()
    readonly rating_ids: number[]

    @IsOptional()
    @IsString({ each: true })
    readonly communities_tags: string[]

    @IsOptional()
    @IsNumber()
    @ApiProperty({ example: 'pilot role(s) id(s)' })
    readonly roles: number[];

    @IsOptional()
    @IsString({ each: true })
    @ApiProperty({ example: 'role(s) seperated by commas' })
    readonly custom_roles: string[];

    // Pilot Info
    @IsOptional()
    @IsNumber()
    readonly home_airport_id: number;
    
    @IsOptional()
    @IsNumber()
    readonly aircraft_ids: number[];
  }