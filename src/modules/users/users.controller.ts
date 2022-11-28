import { UsersService } from './users.service';
import { FETCHED } from '../../common/constants/response.constants';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PilotsService } from './pilots.service';
import { TransformationInterceptor } from 'src/authentication/interceptors/transform.interceptor';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private pilotsService: PilotsService, private usersService: UsersService) {}
  
  @ApiBearerAuth()
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getPopulatedUserById(id);
  }

  @Get('/searchPilotsByName/:pattern')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  async searchPilotsByName(@Param('pattern') pattern: string) {
    return await this.pilotsService.searchPilotsByName(pattern);
  }

  @Get('/getPilotsByHomeAirPort/:airportId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  async getPilotsByHomeAirPort(@Param('airportId') airportId: string) {
    return await this.pilotsService.getPilotsByHomeAirPort(airportId);
  }



  @UseInterceptors(FileInterceptor('file'))
  @Patch()
  async editUserProfile(@Body() editUserDto: EditUserDto, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    return await this.usersService.editUser(req.user._id, editUserDto, file);
  }
}
