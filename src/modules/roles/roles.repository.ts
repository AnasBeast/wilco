import { RoleEntity } from './entities/role.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/database/mongo/models/role.model';

@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async getRoleByFilter(filter: object): Promise<Role> {
    return await await this.roleModel.findOne(filter).exec();
  }

  async createRole(body: RoleEntity): Promise<Role> {
    return await this.roleModel.create(body);
  }
}
