import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsPositive } from "class-validator";

export class TrackDTO {
    @ApiProperty()
    @IsNumberString()
    height: number;

    @ApiProperty()
    @IsNumberString()
    width: number;
}