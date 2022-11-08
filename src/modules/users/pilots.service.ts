import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { errors } from 'src/common/helpers/responses/error.helper';
import { RolesService } from '../roles/roles.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class PilotsService {
  constructor(private usersRepository: UsersRepository, private rolesService: RolesService) {}

  async searchPilotsByName(pattern: string) {
    const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.usersRepository.getUsersByFilter({
      role: pilotRoleExist.id,
      $or: [{ first_name: { $regex: pattern, $options: 'i' } }, { last_name: { $regex: pattern, $options: 'i' } }],
    });
  }
}
