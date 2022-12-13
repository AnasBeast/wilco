import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { errors } from "src/common/helpers/responses/error.helper";
import { Comment, CommentDocument } from "src/database/mongo/models/comment.model";
import { CommentReply, CommentReplyDocument } from "src/database/mongo/models/commentReply.model";
import { PostsService } from "../posts/posts.service";


@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<CommentDocument>,
        @InjectModel(CommentReply.name)
        private readonly commentReplyModel: Model<CommentReplyDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService
    ) {}

    async createComment(input) {
        return await this.commentModel.create(input);
    }

    async createReply(input) {
        return await this.commentReplyModel.create(input);
    }

    async getCommentById(commentId: Types.ObjectId) {
        return await this.commentModel.findById(commentId);
    }

    async getReplyById(replyId: Types.ObjectId) {
        return await this.commentReplyModel.findById(replyId);
    }

    async deleteComment(commentId: string) {
        const comment = await this.getCommentById(new Types.ObjectId(commentId));
        const reply = await this.getReplyById(new Types.ObjectId(commentId));
        if(!comment && !reply) throw new BadRequestException();

        if (!comment) {
            const parentComment = await this.getCommentById(reply.parentCommentId);
            parentComment.replies.filter((reply) => reply !== new Types.ObjectId(commentId));
            parentComment.save();
            const post = await this.postsService.findOne(reply.post);
            post.number_of_comments--;
            post.save();
            return await this.commentReplyModel.deleteOne({ _id: commentId });
        }

        const post = await this.postsService.findOne(comment.post);
        post.comments.filter((comment) => comment !== new Types.ObjectId(commentId));
        post.number_of_comments -= comment.replies.length + 1;
        post.save();
        if (comment.replies.length > 0) {
            this.commentReplyModel.deleteMany({ _id: { $in: comment.replies } })
        }
        return await this.commentModel.deleteOne({ _id: commentId });
    }

    async likeComment(commentId: string, userId: string) {
        const comment = await this.commentModel.findById(commentId);
        const reply = await this.commentReplyModel.findById(commentId);

        if((reply && this.arrayHasValue(reply.likes, userId)) || (comment && this.arrayHasValue(comment.likes, userId))) {
            return comment ? comment : reply;
        }

        if(!comment && reply && !this.arrayHasValue(reply.likes, userId)) {
            reply.number_of_likes++;
            reply.likes.push(new Types.ObjectId(userId));
            return reply.save();
        } else if (!reply && comment && !this.arrayHasValue(comment.likes, userId)) {
            comment.number_of_likes++;
            comment.likes.push(new Types.ObjectId(userId));
            return comment.save();
        }

        throw new NotFoundException();
    }

    async dislikeComment(commentId: string, userId: string) {
        const comment = await this.commentModel.findById(commentId);
        const reply = await this.commentReplyModel.findById(commentId);

        if((reply && this.arrayHasValue(reply.dislikes, userId)) || (comment && this.arrayHasValue(comment.dislikes, userId))) {
            return comment ? comment : reply;
        }

        if(!comment && reply) {
            reply.number_of_dislikes++;
            reply.dislikes.push(new Types.ObjectId(userId));
            return reply.save();
        } else if (!reply && comment) {
            comment.number_of_dislikes++;
            comment.dislikes.push(new Types.ObjectId(userId));
            return comment.save();
        }

        throw new NotFoundException();
    }

    arrayHasValue(array: Types.ObjectId[], value: string) {
        for(let i = 0; i < array.length; i++) {
            if (array[i].toString() === value) {
                return true
            }
        }

        return false
    }

    async getCommentsByPostId(postId: string, pilotId: number) {
        // const post = await this.commentModel.find({ post: postId });
        // if(!post) throw new NotFoundException(errors.POST_NOT_FOUND);

        // if (post)

    }
}