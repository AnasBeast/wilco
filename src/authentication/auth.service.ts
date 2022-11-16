import { SignUpDto } from './dto/sign-up.dto';
import { AuthenticationProvider } from './auth.provider';

import { SignInDto } from './dto/sign-in.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserEntity } from '../common/entities/user.entity';
import { UsersService } from './../modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/mongo/models/user.model';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async login(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.getUserByEmail(signInDto.email);
    if (!user) throw new UnauthorizedException('The Email is incorrect.');

    if (!(await AuthenticationProvider.checkPassword(signInDto.password, user.password))) {
      throw new UnauthorizedException('The password is incorrect.');
    }

    return this.transformUserResponse(user);
  }

  async register(file: Express.Multer.File, signUpDto: SignUpDto): Promise<any> {
    const user = await this.usersService.create(signUpDto, file);

    
    return this.transformUserResponse(user);
  }

  async verifyPayload(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = await this.usersService.getUserByEmail(payload.sub);
    } catch (error) {
      throw new UnauthorizedException(`There isn't any user with email: ${payload.sub}`);
    }
    return this.transformUserResponse(user);
  }

  signToken(email: string): string {
    const payload = {
      sub: email,
    };
    return this.jwtService.sign(payload);
  }

  transformUserResponse(user: User): User {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const newUser = { ...user }._doc;
    delete newUser.password;

    return newUser;
  }
}
