import { FETCHED } from '../../common/constants/response.constants';
import { Body, Controller, Request, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UploadedFile, UseInterceptors, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiTags } from '@nestjs/swagger';
import { TransformationInterceptor } from 'src/authentication/interceptors/transform.interceptor';
import { ResponseMessage } from 'src/common/decorators/response/response.decorator';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddAirportsToPilotDTO } from 'src/dto/pilot/add-airports-to-pilot.dto';
import { GetPilotsDTO } from 'src/dto/pilot/get-pilots.dto';
import { PilotsService } from './pilots.service';

@ApiTags('Pilots')
@Controller('pilots')
export class PilotsController {
  constructor(private pilotsService: PilotsService) {}
  
  // map to GET /1/pilots/ in old api
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pilots' })
  @ApiParam({ name:'page', description: "Number of page requested. Starts from 1." })
  @ApiParam({ name:'per_page', description: "Number of pilots returned per page. Cannot exceed 25" })
  @Get()
  @UseInterceptors(TransformationInterceptor)
  async getPilots(@Body() getPilotsDTO: GetPilotsDTO) {
    return await this.pilotsService.getPilots(getPilotsDTO.page, getPilotsDTO.per_page);
  }

  // map to GET /1/pilots/{id} in old api
  @ApiBearerAuth()
  @ApiParam({ name: "id", description: 'ID of the pilot. "me" may be used to refer to the current pilot.'  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @ApiOperation({ summary: 'Get Pilot By ID' })
  @UseInterceptors(TransformationInterceptor)
  async getPilotById(@Param('id') id: string, @Req() req) {
    return await this.pilotsService.getPilotById(id, req.user.pilotId, req.user.userId);
  }

  // map to PATCH /1/pilots/{id} in old api
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  @ApiOperation({ summary: 'Edit Pilot Profile' })
  @UseInterceptors(TransformationInterceptor)
  async editPilotProfile(@Param('id') id: string, @Body() editUserDto: EditUserDto, @Req() req, @UploadedFile() file?: Express.Multer.File) {
    return await this.pilotsService.editPilotById(id, editUserDto, req.user.pilotId, file);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Pilot' })
  async deleteUser(@Param('id') id: string, @Req() req) {
    return await this.pilotsService.deletePilotById(id, req.user.pilotId);
  }

  @ApiTags('Airport')
  @ApiOperation({ summary: 'Add airports to pilot', description: 'Add airports to pilot', })
  @ApiParam({ name: "id", description: 'ID of the pilot. "me" may be used to refer to the current pilot.'  })
  @ApiBearerAuth()
  @Post(':id/airports')
  async addAirportsToPilot(@Param('id') id: string, @Body() addAirportsToPilotDTO: AddAirportsToPilotDTO , @Req() req) {
    return await this.pilotsService.addAirportsToPilot(id, addAirportsToPilotDTO.preferred_airport_names, req.user.email);
  }

  @ApiBearerAuth()
  @Get('/searchByName/:pattern')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(FETCHED)
  @UseInterceptors(TransformationInterceptor)
  @ApiOperation({ summary: 'Search Pilot By Name' })
  async searchPilotsByName(@Param('pattern') pattern: string) {
    return await this.pilotsService.searchByName(pattern);
  }

  // @Get('/searchByHomeAirPort/:airport_code')
  // @ApiBearerAuth()
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage(FETCHED)
  // @UseInterceptors(TransformationInterceptor)
  // @ApiOperation({ summary: 'Search Pilot By HomeAirport' })
  // async getPilotsByHomeAirPort(@Param('airport_code') airport_code: string) {
  //   return await this.pilotsService.searchByHomeAirPort(airport_code);
  // }

  @ApiBearerAuth()
  @Get('/searchByCommunity/:community_name')
  @ApiOperation({ summary: 'Search Pilot By Community' })
    async getPilotsByCommunity(@Param('community_name') community_name: string) {
    return await this.pilotsService.searchByCommunities(community_name);
  }

}
