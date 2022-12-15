import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/database/mongo/models/post.model';
import { S3Service } from '../files/s3.service';
import { S3Module } from '../files/s3.module';
import { CommentsModule } from '../comments/comments.module';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        name: Post.name,
        useFactory: (connection: Connection) => {
          const schema = PostSchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'post_id_autoincremnt', inc_field: 'id', start_seq: 391 });
          return schema;
        },
        inject: [getConnectionToken()]
      }
    ]),
    S3Module,
    forwardRef(() => CommentsModule) 
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService]
})
export class PostsModule {}
