import { CreateAirportDto } from './dto/create.dto';
import { TransformationInterceptor } from './../../authentication/interceptors/transform.interceptor';
import { CREATED } from './../../common/constants/response.constants';
import { AirportEntity } from './../../common/entities/airport.entity';
import { AirportsService } from './airports.service';
import { Controller, HttpCode, Post, HttpStatus, UseInterceptors, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';

@ApiTags('Airports')
@Controller('airports')
export class AirportsController {
  constructor(private airportsService: AirportsService) {}

  @Post('/')
  @ApiCreatedResponse({ description: 'Airport has been successfully created.', type: AirportEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage(CREATED)
  @UseInterceptors(TransformationInterceptor)
  async createAirport(@Body() body: CreateAirportDto): Promise<AirportEntity> {
    return await this.airportsService.createAirport(body);
  }
}