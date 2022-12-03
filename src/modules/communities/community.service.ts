import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BaseCommunity } from 'src/dto/communities/base-community.dto';
import { Community, CommunityDocument } from 'src/schemas/community.schema';

@Injectable()
export class CommunityService {
  constructor(
    @InjectModel(Community.name)
    private readonly model: Model<CommunityDocument>,
  ) {}

  async findAll(): Promise<Community[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Community> {
    return await this.model.findById(id).exec();
  }

  async findCommunityByFilter(filter: FilterQuery<Community>) {
    return await this.model.findOne(filter).lean();
  }

  async create(createTodoDto: BaseCommunity): Promise<Community> {
    return await new this.model({
      ...createTodoDto,
      createdAt: new Date(),
    }).save();
  }

  async update(id: string, updateTodoDto: BaseCommunity): Promise<Community> {
    return await this.model.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  async delete(id: string): Promise<Community> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
