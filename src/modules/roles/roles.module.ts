import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Role, RoleSchema } from './../../database/mongo/models/role.model';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    { name: Role.name,
       useFactory: async (connection: Connection) => {
        const schema = RoleSchema;
        const autoIncrement = AutoIncrementFactory(connection);
        schema.plugin(autoIncrement, { inc_field: 'id', start_seq: 67 })
        return schema;
    }, 
    inject: [getConnectionToken()] 
  }])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
