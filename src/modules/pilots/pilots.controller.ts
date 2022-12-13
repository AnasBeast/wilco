import { ADDED, FETCHED } from '../../common/constants/response.constants';
import { Body, Controller, Request, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UploadedFile, UseInterceptors, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddAirportsToPilotDTO } from 'src/dto/pilot/add-airports-to-pilot.dto';
import { GetPilotsDTO } from 'src/dto/pilot/get-pilots.dto';
import { PilotsService } from './pilots.service';
import { CreateAirCraftDto } from '../airCrafts/dto/create.dto';
import { AirCraftService } from '../airCrafts/airCrafts.service';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';
import { AirCraftEntity } from 'src/common/entities/airCraft.entity';
import { Pilot } from 'src/database/mongo/models/pilot.model';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { Pagination } from 'src/common/decorators/response/pagination.decorator';

@Controller('pilots')
export class PilotsController {
  constructor(private pilotsService: PilotsService) {}
  
  // map to GET /1/pilots/ in old api
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pilots' })
  @ApiParam({ name:'page', description: "Number of page requested. Starts from 1." })
  @ApiParam({ name:'per_page', description: "Number of pilots returned per page. Cannot exceed 25" })
  @Pagination(true)
  @Get()
  async getPilots(@Query() { page, per_page }: PaginationDTO) {
    console.log(page, per_page);
    return await this.pilotsService.getPilots(Number.parseInt(page), Number.parseInt(per_page));
  }

  // map to GET /1/pilots/{id} in old api
  @ApiTags('Pilots')
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: 'ID of the pilot. "me" may be used to refer to the current pilot.'  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @ApiOperation({ summary: 'Get Pilot By ID' })
  async getPilotById(@Param('id') id: string, @Req() req) {
    return await this.pilotsService.getPilotById(id, req.user.pilotId, req.user.email);
  }

  // map to PATCH /1/pilots/{id} in old api
  @ApiTags('Pilots')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  @ApiOperation({ summary: 'Edit Pilot Profile' })
  async editPilotProfile(@Param('id') id: string, @Body() editUserDto: EditUserDto, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    return await this.pilotsService.editPilotById(id, editUserDto, req.user.pilotId, file);
  }

  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Pilot' })
  async deleteUser(@Param('id') id: string, @Req() req) {
    return await this.pilotsService.deletePilotById(id, req.user.pilotId);
  }

  @ApiTags('Airport')
  @ApiOperation({ summary: 'Add airports to pilot', description: 'Add airports to pilot', })
  @ApiParam({ name: "id", description: 'ID of the pilot. "me" may be used to refer to the current pilot.'  })
  @ApiBearerAuth()
  @Post(':id/airports')
  async addAirportsToPilot(@Param('id') id: number, @Body() addAirportsToPilotDTO: AddAirportsToPilotDTO , @Req() req) {
    return await this.pilotsService.addAirportsToPilot(id, addAirportsToPilotDTO.preferred_airport_names, req.user.pilotId);
  }

  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Get('/searchByName/:pattern')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @ApiOperation({ summary: 'Search Pilot By Name' })
  async searchPilotsByName(@Param('pattern') pattern: string) {
    return await this.pilotsService.searchByName(pattern);
  }

  @Get('/searchByHomeAirPort/:airport_code')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @ApiOperation({ summary: 'Search Pilot By HomeAirport' })
  async getPilotsByHomeAirPort(@Param('airport_code') airport_code: string) {
    return await this.pilotsService.searchByHomeAirPort(airport_code);
  }

  @ApiTags('Pilots')
  @ApiBearerAuth()
  @Get('/searchByCommunity/:community_name')
  @ApiOperation({ summary: 'Search Pilot By Community' })
    async getPilotsByCommunity(@Param('community_name') community_name: string) {
    return await this.pilotsService.searchByCommunities(community_name);
  }

  // aircrafts

  @ApiTags('Aircrafts')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('base_64_picture'))
  @ApiCreatedResponse({ description: 'AirCraft has been successfully created.', type: AirCraftEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ADDED)
  @ApiOperation({ summary: 'Creates a aircraft' })
  @Post("/me/aircrafts")
  async create(@Body() body: CreateAirCraftDto, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    return await this.pilotsService.createAircraft(body, req.user.pilotId, file);
  }
}
