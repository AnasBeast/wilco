import { CreateAirportDto } from './dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionFields } from 'mongoose';
import { Airport, AirportDocument } from 'src/database/mongo/models/airport.model';
import { AirportEntity } from 'src/common/entities/airport.entity';

@Injectable()
export class AirportsRepository {
  constructor(@InjectModel(Airport.name) private airportModel: Model<AirportDocument>) {}

  async getAirportByFilter(filter: FilterQuery<Airport>): Promise<AirportEntity> {
    return await this.airportModel.findOne(filter).lean();
  }

  async getAirportsByFilter(filter: FilterQuery<Airport>, projection: ProjectionFields<Airport>): Promise<ProjectionFields<Airport>[]> {
    return await this.airportModel.find(filter).select(projection).lean();
  }

  async getTransformedAirportsByFilter(filter: FilterQuery<Airport>,): Promise<Airport[]> {
    return await this.airportModel.find(filter).transform(res => res.map(doc => doc.icao)).lean();
  }

  async createAirport(body: CreateAirportDto): Promise<AirportEntity> {
    return await this.airportModel.create(body);
  }
}
