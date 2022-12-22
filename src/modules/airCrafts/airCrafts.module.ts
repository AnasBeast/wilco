import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";
import { AirCraft, AirCraftSchema } from 'src/database/mongo/models/airCraft.model';
import { S3Module } from '../files/s3.module';
import { AirCraftController } from './airCrafts.controller';
import { AirCraftsRepository } from './airCrafts.repository';
import { AirCraftService } from './airCrafts.service';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    { name: AirCraft.name,
      useFactory: (connection: Connection) => {
        const schema = AirCraftSchema;
        const AutoIncrement = AutoIncrementFactory(connection);
        schema.plugin(AutoIncrement, { id: 'aircraft_id_autoincrement', inc_field: 'id', start_seq: 378 })
        return schema;
      },
      inject: [getConnectionToken()]
    }
  ]), S3Module],
  controllers: [AirCraftController],
  providers: [AirCraftService, AirCraftsRepository],
  exports: [AirCraftService]
})
export class AirCraftModule {}
