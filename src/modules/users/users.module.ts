import { UsersController } from './users.controller';
import { PilotsService } from './pilots.service';
import { S3Module } from './../files/s3.module';
import { RolesModule } from './../roles/roles.module';
import { User, UserSchema } from './../../database/mongo/models/user.model';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { IsUserAlreadyExist } from './UserExists';
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), RolesModule, S3Module],
  controllers: [UsersController],
  providers: [UsersService, PilotsService, UsersRepository, IsUserAlreadyExist],
  exports: [UsersService],
})
export class UsersModule {}
