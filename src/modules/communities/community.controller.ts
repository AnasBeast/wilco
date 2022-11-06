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
@ApiTags('community')
export class CommunityController {
    constructor(private readonly service: CommunityService) { }

    @Get()
    @ApiOperation({ summary: 'Get List of Communities' })
    @ApiResponse({
        status: 200,
        description: 'The records found',
        type: [BaseCommunity],
    })
    async index() {
        return await this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Community' })
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BaseCommunity,
    })
    async find(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create Community' })
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BaseCommunity,
    })
    async create(@Body() createCommunityDto: BaseCommunity) {
        return await this.service.create(createCommunityDto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Community' })
    @ApiResponse({
        status: 200,
        description: 'The record updated',
        type: BaseCommunity,
    })
    async update(@Param('id') id: string, @Body() updateCommunityDto: BaseCommunity) {
        return await this.service.update(id, updateCommunityDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Community' })
    @ApiResponse({
        status: 200,
        description: 'The record deleted',
        type: BaseCommunity,
    })
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
