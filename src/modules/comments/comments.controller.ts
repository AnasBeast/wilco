import { Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comments.service";

@ApiBearerAuth()
@ApiTags('comments')
@Controller('comments')
export class CommentController {
    
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Delete(":id")
    async deleteComment(@Param('id') commentId: string) {
        return await this.commentService.deleteComment(commentId);
    }

    @Post("/:id/like")
    async likeComment(@Param("id") commentId: string, @Req() req) {
        return await this.commentService.likeComment(commentId, req.user._id);
    }

    @Post("/:id/dislike")
    async dislikeComment(@Param("id") commentId: string, @Req() req) {
        return await this.commentService.dislikeComment(commentId, req.user._id);
    }
}