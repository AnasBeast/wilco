import { UsersService } from './users.service';
import { FETCHED } from '../../common/constants/response.constants';
import { Controller, Get, HttpCode, HttpStatus, Param, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PilotsService } from './pilots.service';
import { TransformationInterceptor } from 'src/authentication/interceptors/transform.interceptor';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private pilotsService: PilotsService, private usersService: UsersService) {}

  @Get('/searchPilotsByName/:pattern')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  async searchPilotsByName(@Param('pattern') pattern: string) {
    return await this.pilotsService.searchPilotsByName(pattern);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
