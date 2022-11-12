import { CreateAirportDto } from './dto/create.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Airport, AirportDocument } from 'src/database/mongo/models/airport.model';

@Injectable()
export class AirportsRepository {
  constructor(@InjectModel(Airport.name) private airportModel: Model<AirportDocument>) {}

  async getAirportByFilter(filter: object): Promise<Airport> {
    return await this.airportModel.findOne(filter).exec();
  }

  async createAirport(body: CreateAirportDto): Promise<Airport> {
    return await this.airportModel.create(body);
  }
}
