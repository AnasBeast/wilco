import { BadRequestException, Inject, Injectable, NotFoundException, UnprocessableEntityException, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentDislike, CommentDislikeDocument } from "src/database/mongo/models/comment-dislike.model";
import { CommentLike, CommentLikeDocument } from "src/database/mongo/models/comment-like.model";
import { Comment, CommentDocument } from "src/database/mongo/models/comment.model";
import { CommentReply, CommentReplyDocument } from "src/database/mongo/models/commentReply.model";
import { PostsService } from "../posts/posts.service";
import { NotificationsService } from "../notifications/notifications.service";
import { Report, ReportDocument } from "src/database/mongo/models/reports.model";
import { PostDocument, Post } from "src/database/mongo/models/post.model";


@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<CommentDocument>,
        @InjectModel(CommentReply.name)
        private readonly commentReplyModel: Model<CommentReplyDocument>,
        @InjectModel(CommentLike.name)
        private readonly commentLikeModel: Model<CommentLikeDocument>,
        @InjectModel(CommentDislike.name)
        private readonly commentDislikeModel: Model<CommentDislikeDocument>,
        @InjectModel(Report.name)
        private readonly reportModel: Model<ReportDocument>,
        @InjectModel(Post.name)
        private readonly postModel: Model<PostDocument>,
        private readonly notificationService: NotificationsService
    ) {}

    async createComment(input) {
        return await this.commentModel.create(input);
    }

    async createReply(input) {
        return await this.commentReplyModel.create(input);
    }

    async getCommentById(id: number) {
        return await this.commentModel.findOne({ id }).populate("pilot").lean();
    }

    async getReplyById(id: number) {
        return await this.commentReplyModel.findOne({ id });
    }

    async reportComment(id: string) {
        if(isNaN(+id)) throw new BadRequestException();
        const comment = await this.commentModel.findOne({ id: +id });
        if(!comment) throw new NotFoundException();
        return await this.reportModel.create({ reportable_type: "Comment", reportable_id: +id });
    }

    async deleteComment(commentId: string) {
        if(isNaN(+commentId)) {
            throw new BadRequestException();
        }
        const comment = await this.getCommentById(+commentId);
        const reply = await this.getReplyById(+commentId);
        if(!comment && !reply) throw new NotFoundException();

        if (!comment && reply) {
            const post = await this.postModel.findOne({ id: reply.post_id });
            post.number_of_comments--;
            post.save();
            return await this.commentReplyModel.deleteOne({ id: +commentId });
        }

        const post = await this.postModel.findOne({ id: comment.post_id });
        const replies = await this.commentReplyModel.find({ parent_comment_id: comment.id }).count();
        post.number_of_comments -= replies + 1;
        post.save();
        if (replies > 0) {
            this.commentReplyModel.deleteMany({ parent_comment_id: { $in: comment.id } })
        }
        return await this.commentModel.deleteOne({ id: +commentId });
    }

    async likeComment(id: string, pilot_id: number) {
        if(isNaN(+id)) {
            throw new BadRequestException();
        }

        const comment = await this.commentModel.findOne({ id: +id }, {}, { populate: { path: "likes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();
        const reply = await this.commentReplyModel.findOne({ id: +id }, {}, { populate: { path: "likes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();

        console.log(comment);

        if (!comment && !reply) {
            throw new NotFoundException();
        }

        if(comment && !comment.likes.includes(pilot_id)) {
            const like = await this.commentLikeModel.create({ pilot_id, comment_id: comment.id });
            await this.notificationService.pushNotification("Like", like.id, comment.pilot_id, 1);
            return await this.commentModel.findOneAndUpdate({ id: comment.id }, { number_of_likes: comment.number_of_likes + 1 }, { populate: "pilot", returnDocument: 'after' });
        }

        if(reply && !reply.likes.includes(pilot_id)) {
            const like = await this.commentLikeModel.create({ pilot_id, comment_id: reply.id });
            await this.notificationService.pushNotification("Like", like.id, reply.pilot_id, 1);
            return await this.commentReplyModel.findOneAndUpdate({ id: reply.id }, { number_of_likes: reply.number_of_likes + 1 }, { populate: "pilot", returnDocument: 'after' });
        }

        throw new UnprocessableEntityException();
    }

    async dislikeComment(id: string, pilot_id: number) {
        if(isNaN(+id)) {
            throw new BadRequestException();
        }

        const comment = await this.commentModel.findOne({ id: +id }, {}, { populate: { path: "dislikes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();
        const reply = await this.commentReplyModel.findOne({ id: +id }, {}, { populate: { path: "dislikes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();

        if (!comment && !reply) {
            throw new NotFoundException();
        }

        if(comment && !comment.dislikes.includes(pilot_id)) {
            await this.commentDislikeModel.create({ pilot_id, comment_id: comment.id });
            return await this.commentModel.findOneAndUpdate({ id: comment.id }, { number_of_dislikes: comment.number_of_dislikes + 1 }, { populate: "pilot", returnDocument: 'after' });
        }

        if(reply && !reply.dislikes.includes(pilot_id)) {
            await this.commentDislikeModel.create({ pilot_id, comment_id: reply.id });
            return await this.commentReplyModel.findOneAndUpdate({ id: reply.id }, { number_of_dislikes: reply.number_of_dislikes + 1 }, { populate: "pilot", returnDocument: 'after' });
        }

        throw new UnprocessableEntityException();
    }

    async getCommentsByPostId(post_id: number, page: number, per_page: number) {
        return await this.commentModel.find({ post_id }, {}, { skip: (page - 1) * per_page, limit: per_page, populate: [ { path: "pilot" }, { path: "replies", populate: "pilot" } ] }).lean();
    }

    async getCommentsCountByPostId(post_id: string) {
        return await this.commentModel.find({ post_id }).count();
    }
}