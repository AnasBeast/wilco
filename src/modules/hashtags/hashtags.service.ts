import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseHashtags } from 'src/dto/hashtags/base-hashtags.dto';
import { Hashtags, HashtagsDocument } from 'src/schemas/hashtags.schema';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectModel(Hashtags.name)
    private readonly model: Model<HashtagsDocument>,
  ) {}

  async findAll(): Promise<Hashtags[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Hashtags> {
    return await this.model.findById(id).exec();
  }
}
