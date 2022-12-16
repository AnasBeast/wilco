import { PilotsService } from './pilots.service';
import { S3Module } from '../files/s3.module';
import { RolesModule } from '../roles/roles.module';
import { User, UserSchema } from '../../database/mongo/models/user.model';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { IsUserAlreadyExist } from './UserExists';
import { AirportsModule } from '../airports/airports.module';
import { CommunitiesModule } from '../communities/communities.module';
import { CommunityService } from '../communities/community.service';
import { PilotsController } from './pilots.controller';
import { PilotsRepository } from './pilots.repository';
import { UsersModule } from '../users/users.module';
import { AirCraftModule } from '../airCrafts/airCrafts.module';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";
import { Pilot, PilotSchema } from 'src/database/mongo/models/pilot.model';
import { FlightModule } from '../flights/flights.module';
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
  providers: [PilotsService, PilotsRepository, IsUserAlreadyExist],
  exports: [PilotsService, PilotsRepository],
})
export class PilotsModule {}
