import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class PilotDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'James' })
    readonly first_name: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'Lebron' })
    readonly last_name: string;

    @IsNumber({}, { each: true })
    @ApiProperty({ example: 'pilot role(s) id(s) | exp ["635820733ce0994a2711582a"]' })
    readonly roles: number[];

    @IsOptional()
    @IsString({ each: true })
    @ApiProperty({ example: 'custom role(s)' })
    readonly custom_roles: string[];
}

export class CreatePilotDto {
    readonly id_token: string;

    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PilotDto)
    readonly pilot: PilotDto;
}




