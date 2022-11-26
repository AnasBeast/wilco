import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from 'aws-sdk/clients/budgets';
import { ProjectionType, Types } from 'mongoose';
import { RoleEntity } from '../../common/entities/role.entity';
import { errors } from './../../common/helpers/responses/error.helper';
import { CreateRoleDto } from './dto/create.dto';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  async getRoleByFilter(filter: object): Promise<RoleEntity> {
    return await this.rolesRepository.getRoleByFilter(filter);
  }

  async getRolesByFilter(filter: object, projection: ProjectionType<Role>): Promise<RoleEntity[]> {
    return await this.rolesRepository.getRolesByFilter(filter, projection);
  }

  async createRole({ name }: CreateRoleDto): Promise<RoleEntity> {
    const roleExist = await this.rolesRepository.getRoleByFilter({ name });
    if (roleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.rolesRepository.createRole(name);
  }

  async createCustomRoles(roles: CreateRoleDto[], rolesFilterArray: string[]): Promise<RoleEntity[]> {
    console.log("rolesFilterArray", rolesFilterArray);
    const rolesExist = await this.rolesRepository.getRolesByFilter({ name: { $in: rolesFilterArray } }, "_id name");
    console.log("rolesExist", rolesExist)
    if (rolesExist.length === rolesFilterArray.length) {
      return rolesExist;
    } else if (rolesExist.length < rolesFilterArray.length) {
      roles.forEach((role, ind) => {
        rolesExist.forEach((exsitingRole) => {
          if (exsitingRole.name === role.name) {
            roles.splice(ind, 1)
          }
        })
      })
    }

    return await this.rolesRepository.createRoles(roles);
  }
}
