import { Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comments.service";

@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Delete(":id")
    @ApiOperation({ summary: 'Delete a comment' })
    async deleteComment(@Param('id') commentId: string) {
        return await this.commentService.deleteComment(commentId);
    }

    @Post("/:id/like")
    @ApiOperation({ summary: 'Like a comment' })
    async likeComment(@Param("id") commentId: string, @Req() req) {
        return await this.commentService.likeComment(commentId, req.user._id);
    }

    @Post("/:id/dislike")
    @ApiOperation({ summary: 'Disike a comment' })
    async dislikeComment(@Param("id") commentId: string, @Req() req) {
        return await this.commentService.dislikeComment(commentId, req.user._id);
    }
}