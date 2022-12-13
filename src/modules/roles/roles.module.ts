import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';
import { Role, RoleSchema } from './../../database/mongo/models/role.model';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    { name: Role.name,
       useFactory: async (connection: Connection) => {
        const schema = RoleSchema;
        const autoIncrement = AutoIncrementFactory(connection);
        schema.plugin(autoIncrement, { inc_field: 'id', start_seq: 61 })
        return schema;
    }, 
    inject: [getConnectionToken()] 
  }])],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService],
})
export class RolesModule {}
