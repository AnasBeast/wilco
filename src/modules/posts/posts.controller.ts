import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDTO } from 'src/dto/comment/create-comment.dto';
import { BasePost } from 'src/dto/post/base-post.dto';
import { CreatePostDTO } from 'src/dto/post/create-post.dto';
import { FeedDTO } from 'src/dto/post/feed.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) { }

    //TODO implement pagination
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get List of Posts' })
    @ApiResponse({
        status: 200,
        description: 'The records found',
        type: [BasePost],
    })
    @Get()
    async getFeedPosts(@Body() { page, per_page, feed, community_tags, hashtags }: FeedDTO, @Req() req) {
        return await this.postsService.getFeedPosts(page, per_page, req.user._id, feed, community_tags, hashtags);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Post' })
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BasePost,
    })
    @Get(':id')
    async find(@Param('id') id: string) {
        return await this.postsService.findOne(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create Post' })
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BasePost,
    })
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    async create(@Body() createPostDto: CreatePostDTO, @Req() req, @UploadedFiles() files?: Express.Multer.File[]) {
        return await this.postsService.create(createPostDto, req.user._id, files);
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
        return await this.postsService.update(id, updateTodoDto);
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
        return await this.postsService.delete(id);
    }

    // commentes
    @Post("/:id/comments")
    async createComment(@Param('id') postId: string, @Body() createCommentDTO: CreateCommentDTO, @Req() req) {
        return await this.postsService.createComment(postId, createCommentDTO, req.user._id);
    }

    @Get("/:id/comments")
    async getComments(@Param('id') postId: string, @Req() req) {
        return await this.postsService.getComments(postId, req.user._id);
    }
}
