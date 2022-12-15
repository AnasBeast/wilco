import { AirCraftController } from './airCrafts.controller';
import { Module } from '@nestjs/common';
import { AirCraftService } from './airCrafts.service';
import { AirCraftsRepository } from './airCrafts.repository';
import { S3Module } from '../files/s3.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { AirCraft, AirCraftSchema } from 'src/database/mongo/models/airCraft.model';
import { UsersModule } from '../users/users.module';
import { PilotsModule } from '../pilots/pilots.module';
import { Connection } from 'mongoose';
import *  as AutoIncrementFactory from "mongoose-sequence";

@Module({
  imports: [MongooseModule.forFeatureAsync([
    { name: AirCraft.name,
      useFactory: (connection: Connection) => {
        const schema = AirCraftSchema;
        const AutoIncrement = AutoIncrementFactory(connection);
        schema.plugin(AutoIncrement, { id: 'aircraft_id_autoincrement', inc_field: 'id', start_seq: 442 })
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
