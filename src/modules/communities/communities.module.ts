import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Connection } from 'mongoose';
import { Community, CommunitySchema } from 'src/database/mongo/models/community.model';
import * as AutoIncrementFactory from "mongoose-sequence";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        name: Community.name,
        useFactory: (connection: Connection) => {
          const schema = CommunitySchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'community_id_autoincrement', inc_field: 'id', start_seq: 127 })
          return schema;
        },
        inject: [getConnectionToken()]
      },
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunitiesModule {}
