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

  async getDefaultRoles(page: number, per_page: number) {
    return await this.rolesRepository.getPaginatedDefaultRoles(page, per_page);
  }

  async createRole({ name }: CreateRoleDto): Promise<RoleEntity> {
    const roleExist = await this.rolesRepository.getRoleByFilter({ name });
    if (roleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.rolesRepository.createRole(name);
  }

  async createCustomRoles(custom_roles: string[]) {
    const existingRoles = await this.rolesRepository.getRolesByFilter({ name : { $in: custom_roles } }, "name id");
    let FilterdRoles;
    if(existingRoles.length > 0) {
      const existingFilter = existingRoles.map((element) => element.name); 
      FilterdRoles = custom_roles.filter((element) => {
        return !existingFilter.includes(element);
      })
    }
    FilterdRoles = FilterdRoles ? FilterdRoles : custom_roles;
    FilterdRoles = FilterdRoles.map((element) => ({ name: element }))
    return [...await this.rolesRepository.createRoles(FilterdRoles), ...existingRoles];
  }
}
