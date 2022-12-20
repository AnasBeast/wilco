import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { S3Module } from '../files/s3.module';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
//import { IsPilotAlreadyExist } from './PilotExists';
import { User, UserSchema } from 'src/database/mongo/models/user.model';
import { AirportsModule } from '../airports/airports.module';
import { CommunitiesModule } from '../communities/communities.module';
import { DeviceModule } from '../device/device.module';
import { IsUserAlreadyExist } from './UserExists';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";

@Module({
  imports: [MongooseModule.forFeatureAsync([
    { 
      name: User.name,
      useFactory: (connection: Connection) => {
        const schema = UserSchema;
        const autoIncrement = AutoIncrementFactory(connection);
        schema.plugin(autoIncrement, { id: 'user_id_autoincrement', inc_field: 'id', start_seq: 440 });
        return schema;
      },
      inject: [getConnectionToken()]
    }
  ]), DeviceModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService, IsUserAlreadyExist],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
