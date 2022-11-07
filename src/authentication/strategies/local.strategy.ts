import { TokenResponseDto } from './../dto/token.response.dto';
import { SignInDto } from './../dto/sign-in.dto';
import { AuthService } from './../auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: false,
    });
  }

  async validate(signInDto: SignInDto): Promise<TokenResponseDto> {
    return this.authService.login(signInDto);
  }
}
