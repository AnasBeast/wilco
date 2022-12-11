import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Module } from '../files/s3.module';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
//import { IsPilotAlreadyExist } from './PilotExists';
import { User, UserSchema } from 'src/database/mongo/models/user.model';
import { AirportsModule } from '../airports/airports.module';
import { CommunitiesModule } from '../communities/communities.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RolesModule, S3Module, AirportsModule, CommunitiesModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
