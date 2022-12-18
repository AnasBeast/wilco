import { ADDED } from './../../common/constants/response.constants';
import { AirCraftEntity } from './../../common/entities/airCraft.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { CreateAirCraftDto, UpdateAirCraftDto } from './dto/create.dto';
import { AirCraftService } from './airCrafts.service';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';
import { FlightEntity } from 'src/common/entities/flight.entity';
import { errors } from 'src/common/helpers/responses/error.helper';

@ApiTags('Aircrafts')
@Controller('aircrafts')
export class AirCraftController {
  constructor(private airCraftService: AirCraftService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get aircraft's latest flights", description: "Responds with an array containing the latest flights of the given aircraft" })
  @ApiOkResponse({ description: "Latest flights returned" , type: FlightEntity})
  @Get('/:aircraft_id/latest_flights')
  async getAircraftLatestFlights(@Param('aircraft_id') aircraft_id: number, @Req() req) {
    return await this.airCraftService.getAircraftLatestFlights(aircraft_id, req.user.pilotId);
  }

  // @Get()
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get Pilot Aircrafts' })
  // async getAircrafts(@Req() req) {
  //   return await this.airCraftService.getAircraftsByPilotId(req.user.pilotId);
  // }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('base_64_picture'))
  @ApiOperation({ summary: 'Edit Pilot Aircraft', description:"Edits the pilot's aircraft." })
  async editAircraft(@Body() body: UpdateAirCraftDto, @Param('id') id: number, @Req() req) {
    return await this.airCraftService.editAircraft(body, id, req.user.pilotId);
  }

  @Post(':id/remove')
  @ApiOperation({summary:"Remove aircraft from pilot", description:"Removes the given aircraft from the current pilot. The aircraft will still exist but it will not belong to the pilot."})
  async removeAircraftFromPilot(@Param('id') id: number, @Req() req) {
    return await this.airCraftService.removeAircraftFromPilot(id, req.user.pilotId);
  }
}
