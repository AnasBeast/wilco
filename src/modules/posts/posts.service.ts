import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BasePost } from 'src/dto/post/base-post.dto';
import { Post, PostDocument } from 'src/schemas/post.schema';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly model: Model<PostDocument>,
      ) {}
    
      async findAll(): Promise<Post[]> {
        return await this.model.find().exec();
      }
    
      async findOne(id: string): Promise<Post> {
        return await this.model.findById(id).exec();
      }
    
      async create(createTodoDto: BasePost): Promise<Post> {
        return await new this.model({
          ...createTodoDto,
          createdAt: new Date(),
        }).save();
      }
    
      async update(id: string, updateTodoDto: BasePost): Promise<Post> {
        return await this.model.findByIdAndUpdate(id, updateTodoDto).exec();
      }
    
      async delete(id: string): Promise<Post> {
        return await this.model.findByIdAndDelete(id).exec();
      }
}
