import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/database/mongo/models/post.model';
import { S3Service } from '../files/s3.service';
import { S3Module } from '../files/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    S3Module
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
