import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { UserEntity } from '../common/entities/user.entity';
import { REGISTERED, FETCHED } from './../common/constants/response.constants';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TransformationInterceptor } from './interceptors/transform.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('/register')
  // @ApiCreatedResponse({ description: 'User has been successfully created.', type: UserEntity })
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage(REGISTERED)
  // @UseInterceptors(TransformationInterceptor)
  // @ApiOperation({ summary: 'Create new user' })
  // async register(@Body() body: SignUpDto) {
  //   return await this.authService.register(body);
  // }

  // @Get('/me')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get user info' })
  // async me(@Request() req) {
  //   return req.user;
  // }

  // @Post('/login')
  // @ResponseMessage(FETCHED)
  // @ApiForbiddenResponse({ description: 'Forbidden.' })
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Login' })
  // async login(@Body() body: LoginDto) {
  //   return await this.authService.login(body);
  // }
}
