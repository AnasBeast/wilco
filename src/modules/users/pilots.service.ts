import { RoleEntity } from './../../common/entities/role.entity';
import { UserEntity } from './../../common/entities/user.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { errors } from 'src/common/helpers/responses/error.helper';
import { RolesService } from '../roles/roles.service';
import { UsersRepository } from './users.repository';
import { Types } from 'mongoose';

@Injectable()
export class PilotsService {
  constructor(private usersRepository: UsersRepository, private rolesService: RolesService) {}

  private async getPilotRole(): Promise<RoleEntity> {
    const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return pilotRoleExist;
  }

  async searchPilotsByName(pattern: string) {
    const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.usersRepository.getUsersByFilter({
      role: pilotRoleExist.id,
      $or: [{ first_name: { $regex: pattern, $options: 'i' } }, { last_name: { $regex: pattern, $options: 'i' } }],
    });
  }

  async getPilotsByHomeAirPort(airportId: string): Promise<UserEntity[]> {
    const pilotRoleExist = await this.getPilotRole();

    return await this.usersRepository.getUsersByFilter({
      role: pilotRoleExist.id,
      home_airport: new Types.ObjectId(airportId),
    });
  }
}
