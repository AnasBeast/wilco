import { CreateAirportDto } from './dto/create.dto';
import { errors } from './../../common/helpers/responses/error.helper';
import { AirportsRepository } from './airports.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AirportEntity } from 'src/common/entities/airport.entity';
import { Airport } from 'src/database/mongo/models/airport.model';
import { FilterQuery, ProjectionFields } from 'mongoose';
import { Projection } from 'aws-sdk/clients/dynamodb';

@Injectable()
export class AirportsService {
  constructor(private airportsRepository: AirportsRepository) {}

  async getAirportByFilter(filter: FilterQuery<Airport>): Promise<AirportEntity> {
    return await this.airportsRepository.getAirportByFilter(filter);
  }

  async getAirportsByFilter(filter: FilterQuery<Airport>, projection: ProjectionFields<Airport>): Promise<ProjectionFields<Airport>[]> {
    return await this.airportsRepository.getAirportsByFilter(filter, projection);
  }

  async createAirport(body: CreateAirportDto): Promise<AirportEntity> {
    const { name } = body;
    const airportExist = await this.airportsRepository.getAirportByFilter({ name });
    if (airportExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.airportsRepository.createAirport(body);
  }
}
