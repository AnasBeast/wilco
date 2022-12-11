import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseCommunity } from 'src/dto/communities/base-community.dto';
import { CommunityService } from './community.service';

@Controller('community')
@ApiBearerAuth()
@ApiTags('Communities')
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List of Communities' })
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseCommunity],
  })
  @Get()
  async index() {
    return await this.service.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Community' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseCommunity,
  })
  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Community' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseCommunity,
  })
  @Post()
  async create(@Body() createCommunityDto: BaseCommunity) {
    return await this.service.create(createCommunityDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Community' })
  @ApiResponse({
    status: 200,
    description: 'The record updated',
    type: BaseCommunity,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommunityDto: BaseCommunity,
  ) {
    return await this.service.update(id, updateCommunityDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Community' })
  @ApiResponse({
    status: 200,
    description: 'The record deleted',
    type: BaseCommunity,
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
