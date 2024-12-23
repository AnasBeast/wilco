import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";
import { Pilot, PilotSchema } from 'src/database/mongo/models/pilot.model';
import { AirCraftModule } from '../airCrafts/airCrafts.module';
import { AirportsModule } from '../airports/airports.module';
import { CommunitiesModule } from '../communities/communities.module';
import { S3Module } from '../files/s3.module';
import { FlightModule } from '../flights/flights.module';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { PilotsController } from './pilots.controller';
import { PilotsRepository } from './pilots.repository';
import { PilotsService } from './pilots.service';
import { Pilot_Certificates, PilotCertificatesSchema } from 'src/database/mongo/models/pilot-certificates.model';
import { PilotRatingsSchema, Pilot_Ratings } from 'src/database/mongo/models/pilot-ratings.model';
import { PI } from 'aws-sdk';
import { PilotRolesSchema, Pilot_Roles } from 'src/database/mongo/models/pilot-roles.model';
import { CommunityTagsSchema, Community_tags } from 'src/database/mongo/models/community_tags.model';
import { PostsModule } from '../posts/posts.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Like, LikeSchema } from 'src/database/mongo/models/like.model';
import { Comment, CommentSchema } from 'src/database/mongo/models/comment.model';
import { Post, PostSchema } from 'src/database/mongo/models/post.model';
import { Mention, MentionSchema } from 'src/database/mongo/models/mention.model';
import { Report, ReportSchema } from 'src/database/mongo/models/reports.model';
import { AirCraft, AirCraftSchema } from 'src/database/mongo/models/airCraft.model';
@Module({
  imports: [MongooseModule.forFeatureAsync([
    { 
      name: Pilot.name, 
      useFactory: (connection: Connection) => {
        const schema = PilotSchema;
        const autoIncrement = AutoIncrementFactory(connection);
        schema.plugin(autoIncrement, { id: "pilot_id_autoincrement", inc_field: 'id', start_seq: 517 })
        return schema;
      },
      inject: [getConnectionToken()]
    },
    {
      name: Pilot_Certificates.name,
      useFactory: () => PilotCertificatesSchema
    },
    {
      name: Pilot_Ratings.name,
      useFactory: () => PilotRatingsSchema
    },
    {
      name: Community_tags.name,
      useFactory: () => CommunityTagsSchema
    },
    {
      name: AirCraft.name,
      useFactory: () => AirCraftSchema
    },
    {
      name: Like.name,
      useFactory: () => LikeSchema
    },
    {
      name: Comment.name,
      useFactory: () => CommentSchema
    },
    {
      name: Post.name,
      useFactory: () => PostSchema
    },
    {
      name: Mention.name,
      useFactory: () => MentionSchema
    },
    {
      name: Report.name,
      useFactory: () => ReportSchema
    },
    {
      name: Pilot_Roles.name,
      useFactory: (connection: Connection) => {
        const schema = PilotRolesSchema;
        const autoIncrement = AutoIncrementFactory(connection);
        schema.plugin(autoIncrement, { id: 'pilot_roles_id_autoincrement', inc_field: 'id', start_seq: 519 });
        return schema;
      },
      inject: [getConnectionToken()]
    }
  ]), RolesModule, S3Module, AirportsModule, CommunitiesModule, UsersModule, AirCraftModule, FlightModule, PostsModule, NotificationsModule],
  controllers: [PilotsController],
  providers: [PilotsService, PilotsRepository],
  exports: [PilotsService, PilotsRepository],
})
export class PilotsModule {}
