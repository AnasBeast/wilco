import {
  Controller,
  Get
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
  @ApiOperation({ summary: 'Get List of Communities' ,description:"Gets all communities"})
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseCommunity],
  })
  @Get()
  async getCommunities() {
    return await this.service.findAll();
  }
}
