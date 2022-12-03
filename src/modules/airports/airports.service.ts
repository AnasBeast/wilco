import { CreateAirportDto } from './dto/create.dto';
import { errors } from './../../common/helpers/responses/error.helper';
import { AirportsRepository } from './airports.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AirportEntity } from 'src/common/entities/airport.entity';
import { Airport } from 'src/database/mongo/models/airport.model';
import { FilterQuery } from 'mongoose';

@Injectable()
export class AirportsService {
  constructor(private airportsRepository: AirportsRepository) {}

  async getAirportByFilter(filter: FilterQuery<Airport>): Promise<AirportEntity> {
    return await this.airportsRepository.getAirportByFilter(filter);
  }

  async createAirport(body: CreateAirportDto): Promise<AirportEntity> {
    const { name } = body;
    const airportExist = await this.airportsRepository.getAirportByFilter({ name });
    if (airportExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.airportsRepository.createAirport(body);
  }
}
