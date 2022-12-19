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
import { Post_Airports_Module } from '../post_airports/post-airpots.module';
import { FlightModule } from '../flights/flights.module';
import { Like, LikeSchema } from 'src/database/mongo/models/like.model';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';
import { NotificationsModule } from '../notifications/notifications.module';

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
      },
      {
        name: Like.name,
        useFactory: (connection: Connection) => {
          const schema = LikeSchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'post_like_id_autoincrement', inc_field: 'id', start_seq: 965 });
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
