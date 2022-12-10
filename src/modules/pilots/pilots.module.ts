import { PilotsController } from './Pilots.controller';
import { PilotsService } from './pilots.service';
import { S3Module } from './../files/s3.module';
import { RolesModule } from './../roles/roles.module';
import { Pilot, PilotSchema } from './../../database/mongo/models/pilot.model';
import { PilotsRepository } from './pilots.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
//import { IsPilotAlreadyExist } from './PilotExists';
import { AirportsModule } from '../airports/airports.module';
import { CommunitiesModule } from '../communities/communities.module';
import { CommunityService } from '../communities/community.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: Pilot.name, schema: PilotSchema }]), RolesModule, S3Module, AirportsModule, CommunitiesModule],
  controllers: [PilotsController],
  providers: [PilotsService, PilotsRepository],
  exports: [PilotsService],
})
export class PilotsModule {}
