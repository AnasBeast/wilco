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
    const newFilteredRoles = [];
    const rolesExist = await this.rolesRepository.getRolesByFilter({ name: { $in: rolesFilterArray } }, "_id name");
    if (rolesExist.length === rolesFilterArray.length) {
      return rolesExist;
    } else if (rolesExist.length < rolesFilterArray.length) {
      for(let i = 0; i < roles.length; i++) {
        for(let k = 0; k < rolesExist.length; k++) {
          if(rolesExist[k].name === roles[i].name) {
            break
          } else if (k === rolesExist.length - 1 && rolesExist[k].name !== roles[i].name) {
            newFilteredRoles.push(roles[i]);
          }
        }
      }
    }

    const customCreatedRoles = await this.rolesRepository.createRoles(newFilteredRoles);
    return [...customCreatedRoles, ...rolesExist];
  }
}
