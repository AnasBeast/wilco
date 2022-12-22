import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";
import { Like, LikeSchema } from 'src/database/mongo/models/like.model';
import { Post, PostSchema } from 'src/database/mongo/models/post.model';
import { CommentsModule } from '../comments/comments.module';
import { S3Module } from '../files/s3.module';
import { FlightModule } from '../flights/flights.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Post_Airports_Module } from '../post_airports/post-airpots.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        name: Post.name,
        useFactory: (connection: Connection) => {
          const schema = PostSchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'post_id_autoincremnt', inc_field: 'id', start_seq: 426 });
          return schema;
        },
        inject: [getConnectionToken()]
      },
      {
        name: Like.name,
        useFactory: (connection: Connection) => {
          const schema = LikeSchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'post_like_id_autoincrement', inc_field: 'id', start_seq: 1021 });
          return schema;
        },
        inject: [getConnectionToken()]
      }
    ]),
    NotificationsModule,
    S3Module,
    Post_Airports_Module,
    FlightModule,
    forwardRef(() => CommentsModule) 
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService]
})
export class PostsModule {}
