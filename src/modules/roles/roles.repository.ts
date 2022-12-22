import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType } from 'mongoose';
import { Role, RoleDocument } from 'src/database/mongo/models/role.model';
import { RoleEntity } from '../../common/entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async getRoleByFilter(filter: object): Promise<RoleEntity> {
    return await this.roleModel.findOne(filter).exec();
  }

  async getRolesByFilter(filter: FilterQuery<Role>, projection: ProjectionType<Role>): Promise<RoleEntity[]> {
    return await this.roleModel.find(filter, projection).lean();
  }

  async getPaginatedDefaultRoles(page: number, per_page: number) {
    const roles = await this.roleModel.find({ custom: false }, {}, { limit: per_page, skip: (page - 1) * per_page });
    const count = await this.roleModel.find({ custom: false }).count();
    return {
      data: roles,
      pagination: {
        current: (page - 1) * per_page + roles.length,
        pages: Math.ceil(count/per_page),
        first_page: (page - 1) * per_page === 0,
        last_page: count < (page - 1) * per_page + per_page
      }
    }
  }

  async createRole(name: String, custom?: boolean): Promise<RoleEntity> {
    return await this.roleModel.create({ name, custom });
  }

  async createRoles(roles: string[]): Promise<Role[]> {
    return await this.roleModel.create(roles);
  }
}
