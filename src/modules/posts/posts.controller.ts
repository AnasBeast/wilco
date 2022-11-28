import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    UploadedFile,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { BasePost } from 'src/dto/post/base-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('posts')
export class PostsController {

    constructor(private readonly service: PostsService) { }

    //TODO implement pagination
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get List of Posts' })
    @ApiResponse({
        status: 200,
        description: 'The records found',
        type: [BasePost],
    })
    async index() {
        return await this.service.findAll();
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Post' })
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BasePost,
    })
    async find(@Param('id') id: string) {
        return await this.service.findOne(id);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create Post' })
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BasePost,
    })
    async create(@UploadedFile() file: Express.Multer.File,@Body() createPostDto: BasePost) {
        return await this.service.create(createPostDto);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Post' })
    @ApiResponse({
        status: 200,
        description: 'The record updated',
        type: BasePost,
    })
    async update(@Param('id') id: string, @Body() updateTodoDto: BasePost) {
        return await this.service.update(id, updateTodoDto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete Post' })
    @ApiResponse({
        status: 200,
        description: 'The record deleted',
        type: BasePost,
    })
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
