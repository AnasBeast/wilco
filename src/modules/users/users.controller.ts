import { UsersService } from './users.service';
import { FETCHED } from '../../common/constants/response.constants';
import { Body, Controller, Request, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PilotsService } from './pilots.service';
import { TransformationInterceptor } from 'src/authentication/interceptors/transform.interceptor';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Pilots')
@Controller('pilots')
export class UsersController {
  constructor(private pilotsService: PilotsService, private usersService: UsersService) {}
  
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all pilots' })
  async getUsers() {
    return await this.usersService.getUsers();
  }

  // map to GET /1/pilots/{id} in old api
  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  @ApiOperation({ summary: 'Get Pilot By ID' })
  async getUserById(@Param('id') id: string, @Req() req) {

    return await this.usersService.getPopulatedUserById(id, req.user.email);
  }

  // map to PATCH /1/pilots/{id} in old api
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  @ApiOperation({ summary: 'Edit Pilot Profile' })
  async editUserProfile(@Param('id') id: string, @Body() editUserDto: EditUserDto, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    console.log(id, editUserDto, req.user.email, file);
    return await this.usersService.editUserByEmail(id, editUserDto, req.user.email, file);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Pilot' })
  async deleteUser(@Param('id') id: string, @Req() req) {
    return await this.usersService.deleteUserById(id, req.user.email);
  }

  @ApiBearerAuth()
  @Get('/searchByName/:pattern')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  @ApiOperation({ summary: 'Search Pilot By Name' })
  async searchPilotsByName(@Param('pattern') pattern: string) {
    return await this.usersService.searchByName(pattern);
  }

  @Get('/searchByHomeAirPort/:airport_code')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  @ApiOperation({ summary: 'Search Pilot By HomeAirport' })
  async getPilotsByHomeAirPort(@Param('airport_code') airport_code: string) {
    return await this.usersService.searchByHomeAirPort(airport_code);
  }

  @ApiBearerAuth()
  @Get('/searchByCommunity/:community_name')
  @ApiOperation({ summary: 'Search Pilot By Community' })
    async getPilotsByCommunity(@Param('community_name') community_name: string) {
    return await this.usersService.searchByCommunities(community_name);
  }

}
