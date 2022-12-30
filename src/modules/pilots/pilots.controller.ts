import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Pagination } from 'src/common/decorators/response/pagination.decorator';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { AirCraftEntity } from 'src/common/entities/airCraft.entity';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { AddAirportsToPilotDTO } from 'src/dto/pilot/add-airports-to-pilot.dto';
import { CreatePilotDto } from 'src/dto/pilot/create-pilot.dto';
import { EditPilotDto, PilotPatchDto } from 'src/dto/user/update-user.dto';
import { ADDED, FETCHED, REGISTERED } from '../../common/constants/response.constants';
import { CreateAirCraftDto } from '../airCrafts/dto/create.dto';
import { PilotsService } from './pilots.service';

@Controller('pilots')
export class PilotsController {
  constructor(private pilotsService: PilotsService) {}
  
  // map to GET /1/pilots/ in old api
  @ApiTags('Pilots')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pilots' , description:"Gets all pilots" })
  @ApiParam({ name:'page', description: "Number of page requested. Starts from 1." })
  @ApiParam({ name:'per_page', description: "Number of pilots returned per page. Cannot exceed 25" })
  @Pagination(true)
  @Get()
  async getPilots(@Query() { page, per_page }: PaginationDTO) {
    return await this.pilotsService.getPilots(+page, +per_page);
  }

  @ApiTags('Pilots')
  @Post()
  @ApiCreatedResponse({ description: 'Pilot has been successfully created.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(REGISTERED)
  @ApiOperation({ summary: 'Create new pilot' })
  async createPilot(@Body() body: CreatePilotDto, @Req() req) {
    return await this.pilotsService.createPilot(body, req.user.userId);
  }

  // map to GET /1/pilots/{id} in old api
  @ApiTags('Pilots')
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: 'ID of the pilot. "me" may be used to refer to the current pilot.'  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @ApiOperation({ summary: 'Get Pilot By ID' , description:"Gets a pilot by ID" })
  async getPilotById(@Param('id') id: string, @Req() req) {
    return await this.pilotsService.getPilotById(id, req.user.pilotId, req.user.email);
  }

  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Get('/:pilot_id/posts')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @Pagination(true)
  async getPilotPostsById(@Param('pilot_id') id: string, @Req() req, @Query() { page, per_page }: PaginationDTO) {
    return await this.pilotsService.getPilotPostsById(id, req.user.pilotId, +page, +per_page);
  }

  // map to PATCH /1/pilots/{id} in old api
  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Edit Pilot Profile' , description:"Gets pilot's profile" })
  async editPilotProfile(@Param('id') id: string, @Body() editUserDto: EditPilotDto, @Req() req) {
    return await this.pilotsService.editPilotById(id, plainToClass(PilotPatchDto, editUserDto.pilot, { strategy: "excludeAll" }), req.user.pilotId);
  }

  @ApiTags('Pilots')
  @ApiParam({ name: "id", description: 'ID of the pilot. "me" may be used to refer to the current pilot.'  })
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Pilot' , description:"Deletes a pilot. Users can only delete themselves"})
  async deletePilot(@Param('id') id: string, @Req() req) {
    return await this.pilotsService.deletePilotById(id, req.user.pilotId);
  }

  @ApiTags('Airport')
  @ApiOperation({ summary: 'Add airports to pilot', description: 'Add airports to pilot', })
  @ApiParam({ name: "id", description: 'ID of the pilot. "me" may be used to refer to the current pilot.'  })
  @ApiBearerAuth()
  @Post(':id/airports')
  async addAirportsToPilot(@Param('id') id: string, @Body() addAirportsToPilotDTO: AddAirportsToPilotDTO, @Req() req) {
    return await this.pilotsService.addAirportsToPilot(id, addAirportsToPilotDTO.preferred_airport_names, req.user.pilotId);
  }

  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Get('/searchByName/:pattern')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @ApiOperation({ summary: 'Search Pilot By Name' })
  @Pagination(true)
  async searchPilotsByName(@Param('pattern') pattern: string, @Query() { page, per_page }: PaginationDTO) {
    return await this.pilotsService.searchByName(pattern, +page, +per_page);
  }

  @ApiTags('Pilots')
  @Get('/searchByHomeAirPort/:airport_code')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @Pagination(true)
  @ApiOperation({ summary: 'Search Pilot By HomeAirport' })
  async getPilotsByHomeAirPort(@Param('airport_code') airport_code: string, @Query() { page, per_page }: PaginationDTO) {
    return await this.pilotsService.searchByHomeAirPort(airport_code, +page, +per_page);
  }

  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Get('/searchByCommunity/:community_name')
  @ApiOperation({ summary: 'Search Pilot By Community' })
  @Pagination(true)
    async getPilotsByCommunity(@Param('community_name') community_name: string, @Query() { page, per_page }: PaginationDTO) {
    return await this.pilotsService.searchByCommunities(community_name, +page, +per_page);
  }

  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Get('/searchByHomeAircraft/:aircraft_name')
  @ApiOperation({ summary: 'Search Pilot By Community' })
  @Pagination(true)
    async getPilotsByAircraft(@Param('aircraft_name') aircraft_name: string, @Query() { page, per_page }: PaginationDTO) {
    return await this.pilotsService.searchByAircraft(aircraft_name, +page, +per_page);
  }

  // aircrafts

  @ApiTags('Aircrafts')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'AirCraft has been successfully created.', type: AirCraftEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ADDED)
  @ApiOperation({ summary: 'Creates a aircraft' ,description:"Creates an aircraft"})
  @Post("/me/aircrafts")
  async create(@Body() body: CreateAirCraftDto, @Req() req) {
    return await this.pilotsService.createAircraft(body.aircraft, req.user.pilotId);
  }

  // notifications
  @ApiTags('Notifications')
  @ApiBearerAuth()
  @Get('/me/unread_number')
  async getNotificationsUnreadNumber(@Req() req) {
    return await this.pilotsService.getNotificationsUnreadNumber(req.user.pilotId);
  }

  @ApiTags('Notifications')
  @ApiBearerAuth()
  @Get('/me/notifications')
  @Pagination(true)
  async getNotifications(@Req() req, @Query() { page, per_page }: PaginationDTO) {
    return await this.pilotsService.getNotifications(req.user.pilotId, +page, +per_page);
  }

  @Post('/:pilot_id/reports')
  async reportPilot(@Param('pilot_id') id: string) {
      return await this.pilotsService.reportPilot(id);
  }
}
