import { CreateAirportDto } from './dto/create.dto';
import { CREATED } from './../../common/constants/response.constants';
import { AirportEntity } from './../../common/entities/airport.entity';
import { AirportsService } from './airports.service';
import { Controller, HttpCode, Post, HttpStatus, UseInterceptors, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { Airport } from 'src/database/mongo/models/airport.model';

@ApiTags('Airport')
@Controller('airports')
export class AirportsController {
  constructor(private airportsService: AirportsService) {}

  // @Post('/')
  // @ApiBearerAuth()
  // @ApiCreatedResponse({ description: 'Airport has been successfully created.', type: AirportEntity })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @HttpCode(HttpStatus.CREATED)
  // @ResponseMessage(CREATED)
  // async createAirport(@Body() body: CreateAirportDto): Promise<AirportEntity> {
  //   return await this.airportsService.createAirport(body);
  // }
}
