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
import { BaseHashtags } from 'src/dto/hashtags/base-hashtags.dto';
import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
@ApiTags('hashtags')
export class HashtagsController {
  constructor(private readonly service: HashtagsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List of Hashtagss' })
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseHashtags],
  })
  async index() {
    return await this.service.findAll();
  }
}
