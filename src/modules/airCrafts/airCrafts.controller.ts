import { ADDED } from './../../common/constants/response.constants';
import { AirCraftEntity } from './../../common/entities/airCraft.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransformationInterceptor } from 'src/authentication/interceptors/transform.interceptor';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { CreateAirCraftDto } from './dto/create.dto';
import { AirCraftService } from './airCrafts.service';

@ApiTags('airCraft')
@Controller('airCraft')
export class AirCraftController {
  constructor(private airCraftService: AirCraftService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ description: 'AirCraft has been successfully created.', type: AirCraftEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(ADDED)
  @UseInterceptors(TransformationInterceptor)
  async create(@Body() body: CreateAirCraftDto, @UploadedFile() file?: Express.Multer.File): Promise<AirCraftEntity> {
    return await this.airCraftService.create(body, file);
  }

  @Get()
  async getAircrafts(@Res() res) {
    return await this.airCraftService.getAircraftsByPilotEmail(res.locals.user.email);
  }
}
