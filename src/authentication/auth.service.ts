import { AuthenticationProvider } from './auth.provider';
import { SignUpDto } from './dto/sign-up.dto';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from "lodash";
import { User } from 'src/database/mongo/models/user.model';
import { UsersService } from './../modules/users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  //Not Secure for bruteforce attacks
  //Whats the purpose of typescript if we use any
  async login({email, password} : SignInDto): Promise<any> {
    const user = await this.usersService.getUserDocumentByEmail(email);
    if (!user) throw new UnauthorizedException('The Email is incorrect.');

    if(!(await user.comparePassword(password))) {
      throw new UnauthorizedException('The password is incorrect.');
    }

    return this.transformUserResponse(user);
  }

  async register(signUpDto: SignUpDto): Promise<Omit<User, "password">> {
    const user = await this.usersService.create(signUpDto);

    
    return this.transformUserResponse(user);
  }

  // async verifyPayload(payload: JwtPayload): Promise<any> {
  //   let user: User;

  //   try {
  //     user = await this.usersService.getUserByEmail(payload.sub);
  //   } catch (error) {
  //     throw new UnauthorizedException(`There isn't any user with email: ${payload.sub}`);
  //   }
  //   return this.transformUserResponse(user);
  // }

  signToken(email: string): string {
    const payload = {
      sub: email,
    };
    return this.jwtService.sign(payload);
  }

  transformUserResponse(user: User): Omit<User, "password"> {
    delete user.password;
    return user
  }
}
