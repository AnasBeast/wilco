import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { } from 'aws-sdk/clients/acm';
import { FilterQuery, Model, ProjectionType, Types } from 'mongoose';
import { Role, RoleDocument } from 'src/database/mongo/models/role.model';
import { RoleEntity } from '../../common/entities/role.entity';
import { CreateRoleDto } from './dto/create.dto';

@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async getRoleByFilter(filter: object): Promise<RoleEntity> {
    return await this.roleModel.findOne(filter).exec();
  }

  async getRolesByFilter(filter: FilterQuery<Role>, projection: ProjectionType<Role>): Promise<RoleEntity[]> {
    return await this.roleModel.find(filter, projection).lean();
  }

  async createRole(name: String, custom?: boolean): Promise<RoleEntity> {
    return await this.roleModel.create({ name, custom });
  }

  async createRoles(roles: string[]): Promise<Role[]> {
    return await this.roleModel.create(roles);
  }
}
