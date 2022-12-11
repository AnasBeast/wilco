import { ApiParam, ApiProperty } from "@nestjs/swagger";

export class GetPilotsDTO {
    page: number;

    per_page: number;
}