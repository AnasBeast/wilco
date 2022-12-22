import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";
import { User, UserSchema } from 'src/database/mongo/models/user.model';
import { DeviceModule } from '../device/device.module';
import { IsUserAlreadyExist } from './UserExists';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    { 
      name: User.name,
      useFactory: (connection: Connection) => {
        const schema = UserSchema;
        const autoIncrement = AutoIncrementFactory(connection);
        schema.plugin(autoIncrement, { id: 'user_id_autoincrement', inc_field: 'id', start_seq: 503 });
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
