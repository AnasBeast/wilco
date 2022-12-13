import { CreateAirCraftPictureDto, UpdateAirCraftDto } from './dto/create.dto';
import { AirCraft, AirCraftDocument } from '../../database/mongo/models/airCraft.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, FilterQuery, Model, MongooseOptions, QueryOptions, UpdateQuery } from 'mongoose';
import { AirCraftEntity } from 'src/common/entities/airCraft.entity';
import { Types } from 'mongoose';

export type AirCraftCreate = DocumentDefinition<Omit<AirCraft, 'createdAt' | 'updatedAt'>>

@Injectable()
export class AirCraftsRepository {
  constructor(@InjectModel(AirCraft.name) private airCraftModel: Model<AirCraftDocument>) {}

  async getAirCraftByFilter(filter: FilterQuery<AirCraft>): Promise<AirCraft> {
    return await this.airCraftModel.findOne(filter).exec();
  }

  async getAirCraftById(id: number): Promise<AirCraft> {
    return await this.airCraftModel.findOne({ id }).lean();
  }

  async getAirCraftsByFilter(filter: FilterQuery<AirCraft>) {
    return await this.airCraftModel.find(filter);
  }

  async create(body: AirCraftCreate): Promise<AirCraft & { _id: Types.ObjectId }> {
    return await this.airCraftModel.create(body);
  }

  async editAircraftById(id: number, editedAircraft: UpdateQuery<AirCraft>, options: QueryOptions) {
    return await this.airCraftModel.findOneAndUpdate({ id }, editedAircraft, options).lean();
  }

  async removeAircraft(id: number) {
    return await this.airCraftModel.findOneAndUpdate({id}, { removed: true }, { returnDocument: 'after' });
  }
}
