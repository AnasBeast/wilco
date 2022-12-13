import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'src/common/decorators/response/pagination.decorator';
import { BaseHashtags } from 'src/dto/hashtags/base-hashtags.dto';
import { PaginationDTO, PaginationDTOWithSearch } from 'src/dto/pagination.dto';
import { HashtagsService } from './hashtags.service';

@Controller('hashtags')
@ApiTags('Hashtags')
export class HashtagsController {
  constructor(private readonly service: HashtagsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List of Hashtags' , description:"Gets a list of Hashtags" })
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseHashtags],
  })
  @Get()
  @Pagination(true)
  async getHashtags(@Query() { page, per_page, search }: PaginationDTOWithSearch) {
    return await this.service.getHashtags(Number.parseInt(page), Number.parseInt(per_page), search);
  }
}
