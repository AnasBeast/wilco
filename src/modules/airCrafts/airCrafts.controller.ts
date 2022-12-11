import { ADDED } from './../../common/constants/response.constants';
import { AirCraftEntity } from './../../common/entities/airCraft.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { CreateAirCraftDto, UpdateAirCraftDto } from './dto/create.dto';
import { AirCraftService } from './airCrafts.service';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';

@ApiTags('Aircrafts')
@Controller('aircrafts')
export class AirCraftController {
  constructor(private airCraftService: AirCraftService) {}

  // @Post()
  // @ApiBearerAuth()
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiCreatedResponse({ description: 'AirCraft has been successfully created.', type: AirCraftEntity })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage(ADDED)
  // @ApiOperation({ summary: 'Add An Aircraft' })
  // async create(@Body() body: CreateAirCraftDto, @Req() req: Request & { user: { _id: string } }, @UploadedFile() file?: Express.Multer.File): Promise<AirCraft> {
  //   return await this.airCraftService.create(body, req.user._id, file);
  // }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Pilot Aircrafts' })
  async getAircrafts(@Req() req) {
    return await this.airCraftService.getAircraftsByPilotId(req.user.pilotId);
  }

  @Get('/:id/latest_flights')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Aircraft Latest Flights' })
  async getAircraftLatestFlights(@Param('id') id: string, @Req() req) {
    return await this.airCraftService.getAircraftLatestFlights(id, req.user.pilotId);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Edit Pilot Aircraft' })
  async editAircraft(@Body() body: UpdateAirCraftDto ,@Param('id') id: string, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    return await this.airCraftService.editAircraft(body, id, req.user._id, file);
  }

  @Post(':id/remove')
  async removeAircraftFromPilot(@Param('id') id: string, @Req() req) {
    return await this.airCraftService.removeAircraftFromPilot(id, req.user.pilotId);
  }
}
