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
@Module({
  imports: [MongooseModule.forFeatureAsync([
    { 
      name: Pilot.name, 
      useFactory: (connection: Connection) => {
        const schema = PilotSchema;
        const autoIncrement = AutoIncrementFactory(connection);
        schema.plugin(autoIncrement, { id: "pilot_id_autoincrement", inc_field: 'id', start_seq: 446 })
        return schema;
      },
      inject: [getConnectionToken()]
    }
  ]), RolesModule, S3Module, AirportsModule, CommunitiesModule, UsersModule, AirCraftModule, FlightModule],
  controllers: [PilotsController],
  providers: [PilotsService, PilotsRepository],
  exports: [PilotsService, PilotsRepository],
})
export class PilotsModule {}
