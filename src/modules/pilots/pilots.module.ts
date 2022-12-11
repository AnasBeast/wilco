import { PilotsService } from './pilots.service';
import { S3Module } from '../files/s3.module';
import { RolesModule } from '../roles/roles.module';
import { User, UserSchema } from '../../database/mongo/models/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { IsUserAlreadyExist } from './UserExists';
import { AirportsModule } from '../airports/airports.module';
import { CommunitiesModule } from '../communities/communities.module';
import { CommunityService } from '../communities/community.service';
import { PilotsController } from './pilots.controller';
import { PilotsRepository } from './pilots.repository';
import { UsersModule } from '../users/users.module';
import { Pilot, PilotSchema } from 'src/database/mongo/models/pilot.model';
@Module({
  imports: [MongooseModule.forFeature([{ name: Pilot.name, schema: PilotSchema }]), RolesModule, S3Module, AirportsModule, CommunitiesModule, UsersModule],
  controllers: [PilotsController],
  providers: [PilotsService, PilotsRepository, IsUserAlreadyExist],
  exports: [PilotsService],
})
export class PilotsModule {}
