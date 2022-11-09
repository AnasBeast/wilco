import { CreateAirCraftPictureDto } from './dto/create.dto';
import { AirCraft, AirCraftDocument } from '../../database/mongo/models/airCraft.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AirCraftsRepository {
  constructor(@InjectModel(AirCraft.name) private airCraftModel: Model<AirCraftDocument>) {}

  async getAirCraftByFilter(filter: object): Promise<AirCraft> {
    return await this.airCraftModel.findOne(filter).exec();
  }

  async create(body: CreateAirCraftPictureDto): Promise<AirCraft> {
    return await this.airCraftModel.create(body);
  }
}
