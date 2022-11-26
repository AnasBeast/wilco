import { SignUpDto } from './dto/sign-up.dto';

import { Injectable } from '@nestjs/common';
import { User } from 'src/database/mongo/models/user.model';
import { UsersService } from './../modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(signUpDto: SignUpDto): Promise<Omit<User, "password">> {
    return await this.usersService.create(signUpDto);
  }

  // transformUserResponse(user: User): Omit<User, "password"> {
  //   delete user.password;
  //   return user
  // }
}
