import { Body, Controller, Get, Param, Patch, Post, Req, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FlightEntity } from 'src/common/entities/flight.entity';
import { AirCraftService } from './airCrafts.service';
import { UpdateAirCraftDto } from './dto/create.dto';

@ApiTags('Aircrafts')
@Controller('aircrafts')
export class AirCraftController {
  constructor(private airCraftService: AirCraftService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get aircraft's latest flights", description: "Responds with an array containing the latest flights of the given aircraft" })
  @ApiOkResponse({ description: "Latest flights returned" , type: FlightEntity})
  @Get('/:aircraft_id/latest_flights')
  async getAircraftLatestFlights(@Param('aircraft_id') aircraft_id: string, @Req() req) {
    return await this.airCraftService.getAircraftLatestFlights(aircraft_id, req.user.pilotId);
  }

  @ApiOperation({ summary: 'Edit Pilot Aircraft', description:"Edits the pilot's aircraft." })
  @Patch('/:aircraft_id')
  async editAircraft(@Body() body: UpdateAirCraftDto, @Param('aircraft_id') id: string, @Req() req) {
    return await this.airCraftService.editAircraft(body.aircraft, id, req.user.pilotId);
  }

  @Post(':aircraft_id/remove')
  @ApiOperation({summary:"Remove aircraft from pilot", description:"Removes the given aircraft from the current pilot. The aircraft will still exist but it will not belong to the pilot."})
  async removeAircraftFromPilot(@Param('aircraft_id') id: string, @Req() req) {
    return await this.airCraftService.removeAircraftFromPilot(id, req.user.pilotId);
  }
}
