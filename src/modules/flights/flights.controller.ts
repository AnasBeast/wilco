import { Controller, Get, Param, Query } from "@nestjs/common";
import { TrackDTO } from "src/dto/flight/track.dto";
import { FlightService } from "./flights.service";

@Controller('flights')
export class FlightController {
    constructor(private flightService: FlightService) {}

    @Get('/:external_id/track')
    async getTrack(@Param('external_id') external_id: string, @Query() { height, width }: TrackDTO) {
        return await this.flightService.getTrack(external_id, height, width);
    }

}