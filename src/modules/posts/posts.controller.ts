import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
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
import { Pagination } from 'src/common/decorators/response/pagination.decorator';
import { CreateCommentDTO } from 'src/dto/comment/create-comment.dto';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { BasePost } from 'src/dto/post/base-post.dto';
import { CreatePostDTO } from 'src/dto/post/create-post.dto';
import { FeedDTO } from 'src/dto/post/feed.dto';
import { PostsService } from './posts.service';
import { Buffer } from 'node:buffer';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) { }

    @ApiTags("Posts")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get List of Posts' , description:"Gets the most recent posts with pagination. The \"liked\" property of each returned post indicates whether the post is liked by the current pilot or not."})
    @ApiResponse({
        status: 200,
        description: 'The records found',
        type: [BasePost],
    })
    @Pagination(true)
    @Get()
    async getFeedPosts(@Query() { feed, community_tags, hashtags }: FeedDTO, @Query() { page, per_page }: PaginationDTO, @Req() req) {
        return await this.postsService.getFeedPosts(Number.parseInt(page), Number.parseInt(per_page), req.user.pilotId, feed, community_tags, hashtags);
    }

    @ApiTags("Posts")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Post' , description:"Gets a post by its ID. The \"liked\" property indicates whether the post is liked by the current pilot or not."})
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BasePost,
    })
    @Get(':id')
    async getPost(@Param('id') id: number, @Req() req) {
        return await this.postsService.getPostById(id, req.user.pilotId);
    }

    @ApiTags("Posts")
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create Post' , description:"Creates a post" })
    @ApiResponse({
        status: 200,
        description: 'The record found',
        type: BasePost,
    })
    @Post()
    async create(@Body() createPostDto: CreatePostDTO, @Req() req) {
        return await this.postsService.create(createPostDto, req.user.pilotId);
    }

    @ApiTags("Posts")
    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edit Post' , description:"Edits a post. Can only edit title, text, visibility and add or delete photos"})
    @ApiResponse({
        status: 200,
        description: 'The record updated',
        type: BasePost,
    })
    async update(@Param('id') id: string, @Body() updateTodoDto: BasePost) {
        return await this.postsService.update(id, updateTodoDto);
    }

    @ApiTags("Posts")
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete Post' , description:"Deletes a post. Users can only delete their own posts." })
    @ApiResponse({
        status: 200,
        description: 'The record deleted',
        type: BasePost,
    })
    async delete(@Param('id') id: string) {
        return await this.postsService.delete(id);
    }

    @Post(':post_id/like')
    async likePost(@Param('post_id') post_id: string, @Req() req) {
      return await this.postsService.likePost(post_id, req.user.pilotId);
    }

    @Post(':post_id/unlike')
    async unlikePost(@Param('post_id') post_id: string, @Req() req) {
      return await this.postsService.unlikePost(post_id, req.user.pilotId);
    }

    // commentes
    @ApiTags('Comments')
    @Get("/:post_id/comments")
    @ApiOperation({ summary: "Get post's comments", description: "Gets a post's comments with pagination" })
    async getComments(@Param('post_id') post_id: string, @Query('page') page: number, @Query('per_page') per_page: number, @Req() req) {
        return await this.postsService.getComments(post_id, page, per_page, req.user.pilotId);
    }

    @ApiTags('Comments')
    @Post("/:id/comments")
    @ApiOperation({ summary: 'Post a comment' ,description:"Creates a comment to a post"})
    async createComment(@Param('id') postId: string, @Body() createCommentDTO: CreateCommentDTO, @Req() req) {
        return await this.postsService.createComment(postId, createCommentDTO, req.user._id);
    }

}
