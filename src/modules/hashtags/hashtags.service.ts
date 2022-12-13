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

  async getHashtags(page: number, per_page: number, search: string) {
    if(search) {
      const hashtags = await this.model.find({ $text: { $search: search } }, {}, { skip: (page - 1) * per_page, limit: per_page }).lean();
      const count = await this.model.find({ $text: { $search: search } }).count();

      return {
        data: hashtags,
        pagination: {
          current: (page - 1) * per_page + hashtags.length,
          pages: Math.ceil(count / per_page),
          first_page: (page - 1) * per_page === 0,
          last_page: count < (page - 1) * per_page + per_page,
        }
      }
    }
    const hashtags = await this.model.find({}, {}, { skip: (page - 1) * per_page, limit: per_page }).lean();
    const count = await this.model.count();
    return { 
      data: hashtags, 
      pagination: { 
        current: (page - 1) * per_page + hashtags.length,
          pages: Math.ceil(count / per_page),
          first_page: (page - 1) * per_page === 0,
          last_page: count < (page - 1) * per_page + per_page,
       } 
    };
  }

  // async findOne(id: string): Promise<Hashtags> {
  //   return await this.model.findById(id).exec();
  // }
}
