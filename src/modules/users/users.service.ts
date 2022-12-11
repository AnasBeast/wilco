import { RoleEntity } from '../../common/entities/role.entity';
import { PilotEntity } from '../../common/entities/pilot.entity';
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { errors } from 'src/common/helpers/responses/error.helper';
import { RolesService } from '../roles/roles.service';
import { UsersRepository } from './users.repository';
import { Types } from 'mongoose';
import { Pilot } from 'src/database/mongo/models/pilot.model';
import { TokenResponseDto } from 'src/authentication/dto/token.response.dto';
import fb_admin from 'src/main';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private rolesService: RolesService) {}

  private async getPilotRole(): Promise<RoleEntity> {
    const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return pilotRoleExist;
  }

  async getPopulatedUserById(id: string, userId: string) {
    if (id === "me" || id === userId) {
     // return await this.PilotsRepository.getMe(userId);
    }
    return await this.usersRepository.getPopulatedUserById(id);
  }

  async login(token: string): Promise<TokenResponseDto> {
    let firebase_uid: string;
    try {
      const decodedToken = await fb_admin.auth().verifyIdToken(token);
      firebase_uid = decodedToken.uid;
      return { 
        access_token: token, 
        token_type: 'Bearer',
        created_at: decodedToken.iat, 
        expires_in: decodedToken.exp
      };

    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  // async create({ email, password, custom_roles, first_name, last_name, roles }: SignUpDto): Promise<Pilot> {
  //   const roleExist = await this.rolesService.getRolesByFilter({ _id: {$in: roles} }, { select: "_id" });
  //   if (!roleExist || roles.length !== roleExist.length) throw new HttpException(errors.ROLE_NOT_EXIST, HttpStatus.BAD_REQUEST)



  //   let createdRoles: RoleEntity[] = [];
  //   if (custom_roles) {
  //     let newRoles: RoleEntity[] = [];
  //     let rolesFilterArray: string[] = [] 

  //     custom_roles.split(",").map((role) => {
  //       rolesFilterArray.push(role)
  //       newRoles.push({ name: role, custom: true })
  //     })

  //     createdRoles = await this.rolesService.createCustomRoles(newRoles, rolesFilterArray);
  //   }

  //   let firebase_uid: string;
  //   try {
  //     const user = await fb_admin.auth().createUser({
  //       email,
  //       password
  //     });
  //     firebase_uid = user.uid;
  //   } catch (error) {
  //     throw new UnauthorizedException(error.message);
  //   }

  //   const newUser = await this.pilotsRepository.createNewUser({...{email, first_name, last_name, firebase_uid}, roles: [...roles, ...createdRoles.map((role) => role._id)]});

  //   await fb_admin.auth().setCustomUserClaims(firebase_uid, { _id: newUser._id });

  //   return newUser;
  // }




}
