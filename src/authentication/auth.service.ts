import { SignUpDto } from './dto/sign-up.dto';

import { Injectable } from '@nestjs/common';
import { UsersService } from './../modules/users/users.service';
import { UserEntity } from 'src/common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(signUpDto: SignUpDto): Promise<UserEntity> {
    return await this.usersService.create(signUpDto);
  }

  // transformUserResponse(user: User): Omit<User, "password"> {
  //   delete user.password;
  //   return user
  // }
}
