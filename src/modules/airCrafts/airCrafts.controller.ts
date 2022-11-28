import { ADDED } from './../../common/constants/response.constants';
import { AirCraftEntity } from './../../common/entities/airCraft.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransformationInterceptor } from 'src/authentication/interceptors/transform.interceptor';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { CreateAirCraftDto, UpdateAirCraftDto } from './dto/create.dto';
import { AirCraftService } from './airCrafts.service';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';

@ApiTags('aircrafts')
@Controller('aircrafts')
export class AirCraftController {
  constructor(private airCraftService: AirCraftService) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ description: 'AirCraft has been successfully created.', type: AirCraftEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ADDED)
  async create(@Body() body: CreateAirCraftDto, @Req() req: Request & { user: { _id: string } }, @UploadedFile() file?: Express.Multer.File): Promise<AirCraft> {
    return await this.airCraftService.create(body, req.user._id, file);
  }

  @Get()
  @ApiBearerAuth()
  async getAircrafts(@Req() req) {
    return await this.airCraftService.getAircraftsByPilotId(req.user._id);
  }

  @Get('/:id/latest_flights')
  @ApiBearerAuth()
  async getAircraftLatestFlights(@Param('id') id: string, @Req() req) {
    return await this.airCraftService.getAircraftLatestFlights(id, req.user._id);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'))
  async editAircraft(@Body() body: UpdateAirCraftDto ,@Param('id') id: string, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    return await this.airCraftService.editAircraft(body, id, req.user._id, file);
  }
}
