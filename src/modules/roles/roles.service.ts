import { RoleEntity } from '../../common/entities/role.entity';
import { errors } from './../../common/helpers/responses/error.helper';
import { CreateRoleDto } from './dto/create.dto';
import { RolesRepository } from './roles.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  async getRoleByFilter(filter: object): Promise<RoleEntity> {
    return await this.rolesRepository.getRoleByFilter(filter);
  }

  async createRole(body: CreateRoleDto): Promise<RoleEntity> {
    const { name } = body;
    const roleExist = await this.rolesRepository.getRoleByFilter({ name });
    if (roleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.rolesRepository.createRole(body);
  }
}
