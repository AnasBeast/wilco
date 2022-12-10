import { RoleEntity } from './../../common/entities/role.entity';
import { PilotEntity } from './../../common/entities/pilot.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { errors } from 'src/common/helpers/responses/error.helper';
import { RolesService } from '../roles/roles.service';
import { PilotsRepository } from './pilots.repository';
import { Types } from 'mongoose';
import { Pilot } from 'src/database/mongo/models/pilot.model';

@Injectable()
export class PilotsService {
  constructor(private pilotsRepository: PilotsRepository, private rolesService: RolesService) {}

  private async getPilotRole(): Promise<RoleEntity> {
    const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return pilotRoleExist;
  }

  async getPopulatedUserById(id: string, userId: string) {
    if (id === "me" || id === userId) {
     // return await this.PilotsRepository.getMe(userId);
    }
    return await this.pilotsRepository.getPopulatedUserById(id);
  }




}
