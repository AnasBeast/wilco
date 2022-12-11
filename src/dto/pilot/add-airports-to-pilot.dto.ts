import { ApiProperty } from "@nestjs/swagger";

export class AddAirportsToPilotDTO {

    @ApiProperty({ example: ["string"] })
    preferred_airport_names: string[];
}