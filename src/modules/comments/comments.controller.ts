import { Controller, Delete, Param, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comments.service";

@ApiBearerAuth()
@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Delete(":comment_id")
    @ApiOperation({ summary: 'Delete a comment', description:"Deletes a comment. Users can only delete their own comments."})
    async deleteComment(@Param('comment_id') comment_id: string) {
        return await this.commentService.deleteComment(comment_id);
    }

    @Post("/:comment_id/like")
    @ApiOperation({ summary: 'Like a comment' })
    async likeComment(@Param("comment_id") comment_id: string, @Req() req) {
        return await this.commentService.likeComment(comment_id, req.user.pilotId);
    }

    @Post("/:comment_id/dislike")
    @ApiOperation({ summary: 'Disike a comment' })
    async dislikeComment(@Param("comment_id") comment_id: string, @Req() req) {
        return await this.commentService.dislikeComment(comment_id, req.user.pilotId);
    }
}