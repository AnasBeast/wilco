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
import { SignUpDto } from 'src/authentication/dto/sign-up.dto';

@Injectable()
export class UsersService {

  constructor(private usersRepository: UsersRepository) {}

  async register({ email, password }: SignUpDto) {
    let firebase_uid: string;
    try {
      const user = await fb_admin.auth().createUser({
        email,
        password
      });
      firebase_uid = user.uid;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    const newUser = await this.usersRepository.createNewUser({ email, firebase_uid });
    return newUser;
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
}
