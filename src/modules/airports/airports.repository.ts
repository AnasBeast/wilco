import { CreateAirportDto } from './dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Airport, AirportDocument } from 'src/database/mongo/models/airport.model';
import { AirportEntity } from 'src/common/entities/airport.entity';

@Injectable()
export class AirportsRepository {
  constructor(@InjectModel(Airport.name) private airportModel: Model<AirportDocument>) {}

  async getAirportByFilter(filter: FilterQuery<Airport>): Promise<AirportEntity> {
    console.log(filter);
    return await this.airportModel.findOne(filter).lean();
  }

  async createAirport(body: CreateAirportDto): Promise<AirportEntity> {
    return await this.airportModel.create(body);
  }
}
