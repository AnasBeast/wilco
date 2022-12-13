import { FETCHED } from '../../common/constants/response.constants';
import { Body, Controller, Request, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/me")
  async getMe(@Req() req) {
    return await this.usersService.getPopulatedUserById(req.user.userId);
  }
  /*
  @ApiBearerAuth()
  @Get()
  async getPilots() {
    return await this.PilotsService.getPilots();
  }

  @Get('/me')
  @ApiBearerAuth()
  async me(@Request() req) {
    return await this.PilotsService.getPopulatedUserByEmail(req.user.email);
  }
*/
  // map to GET /1/pilots/{id} in old api
  // @ApiBearerAuth()
  // @Get(':id')
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage(FETCHED)
  // async getPilotById(@Param('id') id: string, @Req() req) {
  //   console.log('serving from pilots')
  //   return await this.PilotsService.getPopulatedUserById(id, req.user._id);
  // }
/*
  // map to PATCH /1/pilots/{id} in old api
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  async editUserProfile(@Param('id') id: string, @Body() editUserDto: EditUserDto, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    console.log(id, editUserDto, req.user._id, file);
    return await this.PilotsService.editUserById(id, editUserDto, req.user._id, file);
  }

  @ApiBearerAuth()
  @Delete('id')
  async deleteUser(@Param('id') id: string, @Req() req) {
    return await this.PilotsService.deleteUserById(id, req.user._id);
  }

  @ApiBearerAuth()
  @Get('/searchByName/:pattern')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  async searchPilotsByName(@Param('pattern') pattern: string) {
    return await this.PilotsService.searchByName(pattern);
  }

  @Get('/searchByHomeAirPort/:airport_code')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  async getPilotsByHomeAirPort(@Param('airport_code') airport_code: string) {
    return await this.PilotsService.searchByHomeAirPort(airport_code);
  }

  @ApiBearerAuth()
  @Get('/searchByCommunity/:community_name')
  async getPilotsByCommunity(@Param('community_name') community_name: string) {
    return await this.PilotsService.searchByCommunities(community_name);
  }
*/
}
