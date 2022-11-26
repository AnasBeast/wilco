import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsPositive } from "class-validator";
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
    @IsMongoId({ each: true })
    @ApiProperty({ example: 'pilot role(s) id(s) | exp ["635820733ce0994a2711582a"]' })
    readonly roles: Types.ObjectId[];

    @IsOptional()
    @IsNotEmpty()
    readonly banner: string;
  
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty({ example: 'role(s) seperated by commas' })
    readonly custom_roles: string;

    // Pilot Info
    @IsOptional()
    @IsMongoId()
    readonly home_airport: Types.ObjectId;
    
    @IsOptional()
    @IsMongoId({ each: true })
    readonly aircrafts: Types.ObjectId[];

    @IsOptional()
    @IsMongoId()
    readonly primary_aircraft;

    @IsOptional()
    @IsMongoId({ each: true })
    communities: Types.ObjectId[]

    // credentials
    @IsOptional()
    @IsMongoId({ each: true })
    certificates: Types.ObjectId[]

    @IsOptional()
    @IsMongoId({ each: true })
    ratings: Types.ObjectId[]

    @IsOptional()
    @IsPositive()
    total_hours: number;
  }