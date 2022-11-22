import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { UserEntity } from '../common/entities/user.entity';
import { REGISTERED } from './../common/constants/response.constants';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Public } from './guards/jwt-auth.guard';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TransformationInterceptor } from './interceptors/transform.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @Public()
  @ApiCreatedResponse({ description: 'User has been successfully created.', type: UserEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(REGISTERED)
  @UseInterceptors(TransformationInterceptor)
  @UseInterceptors(TokenInterceptor)
  async register(@Body() body: SignUpDto) {
    return this.authService.register(body);
  }

  @Post('/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformationInterceptor)
  @UseInterceptors(TokenInterceptor)
  async login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @Get('/me')
  @ApiBearerAuth()
  async me(@Request() req) {
    return req.user;
  }
}
