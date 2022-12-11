import { SignUpDto } from './dto/sign-up.dto';

import { Injectable } from '@nestjs/common';
import { UsersService } from './../modules/users/users.service';
import { UserEntity } from 'src/common/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token.response.dto';

@Injectable()
export class AuthService {
  // constructor(private usersService: UsersService) {}

  // async register(signUpDto: SignUpDto): Promise<UserEntity> {
  //   return await this.usersService.create(signUpDto);
  // }

  // async login(loginDTO: LoginDto): Promise<TokenResponseDto> {
  //   return await this.usersService.login(loginDTO.assertion);
  // }

}
