import { TransformationInterceptor } from './interceptors/transform.interceptor';
import { REGISTERED } from './../common/constants/response.constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { UserEntity } from './../modules/users/entities/user.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUser } from 'src/common/decorators/metadata/users.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({ description: 'User has been successfully created.', type: UserEntity })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(REGISTERED)
  @UseInterceptors(TransformationInterceptor)
  @UseInterceptors(TokenInterceptor)
  async register(@UploadedFile() file: Express.Multer.File, @Body() body: SignUpDto): Promise<any> {
    return this.authService.register(file, body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformationInterceptor)
  @UseInterceptors(TokenInterceptor)
  async login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async me(@AuthUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
