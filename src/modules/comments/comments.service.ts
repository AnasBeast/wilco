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


@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<CommentDocument>,
        @InjectModel(CommentReply.name)
        private readonly commentReplyModel: Model<CommentReplyDocument>,
        @Inject(forwardRef(() => PostsService))
        private readonly postsService: PostsService,
        @InjectModel(CommentLike.name)
        private readonly commentLikeModel: Model<CommentLikeDocument>,
        @InjectModel(CommentDislike.name)
        private readonly commentDislikeModel: Model<CommentDislikeDocument>,
        @InjectModel(Report.name)
        private readonly reportModel: Model<ReportDocument>,
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

    // TODO: fix
    async deleteComment(commentId: string) {
        // const comment = await this.getCommentById(new Types.ObjectId(commentId));
        // const reply = await this.getReplyById(new Types.ObjectId(commentId));
        // if(!comment && !reply) throw new BadRequestException();

        // if (!comment) {
        //     const parentComment = await this.getCommentById(reply.parentCommentId);
        //     parentComment.replies.filter((reply) => reply !== new Types.ObjectId(commentId));
        //     parentComment.save();
        //     const post = await this.postsService.findOne(reply.post);
        //     post.number_of_comments--;
        //     post.save();
        //     return await this.commentReplyModel.deleteOne({ _id: commentId });
        // }

        // const post = await this.postsService.findOne(comment.post);
        // post.comments.filter((comment) => comment !== new Types.ObjectId(commentId));
        // post.number_of_comments -= comment.replies.length + 1;
        // post.save();
        // if (comment.replies.length > 0) {
        //     this.commentReplyModel.deleteMany({ _id: { $in: comment.replies } })
        // }
        // return await this.commentModel.deleteOne({ _id: commentId });
    }

    async likeComment(id: string, pilot_id: number) {
        const comment = await this.commentModel.findOne({ id }, {}, { populate: { path: "likes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();
        const reply = await this.commentReplyModel.findOne({ id }, {}, { populate: { path: "likes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();

        if (!comment && !reply) {
            throw new NotFoundException();
        }

        if(comment && !comment.likes.includes(pilot_id)) {
            const like = await this.commentLikeModel.create({ pilot_id, comment_id: comment.id });
            await this.notificationService.pushNotification("Like", like.id, comment.pilot_id, 1);
            return await this.commentModel.findOneAndUpdate({ id }, { number_of_likes: comment.number_of_likes ?? 0 + 1 }, { populate: "pilot", returnDocument: 'after' });
        }

        if(reply && !reply.likes.includes(pilot_id)) {
            const like = await this.commentLikeModel.create({ pilot_id, comment_id: comment.id });
            await this.notificationService.pushNotification("Like", like.id, reply.pilot_id, 1);
            return await this.commentReplyModel.findOneAndUpdate({ id }, { number_of_likes: comment.number_of_likes ?? 0 + 1 }, { populate: "pilot", returnDocument: 'after' });
        }

        throw new UnprocessableEntityException();
    }

    async dislikeComment(id: string, pilot_id: number) {
        const comment = await this.commentModel.findOne({ id }, {}, { populate: { path: "dislikes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();
        const reply = await this.commentReplyModel.findOne({ id }, {}, { populate: { path: "dislikes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();

        if (!comment && !reply) {
            throw new NotFoundException();
        }

        if(comment && !comment.dislikes.includes(pilot_id)) {
            await this.commentDislikeModel.create({ pilot_id, comment_id: comment.id });
            return await this.commentModel.findOneAndUpdate({ id }, { number_of_dislikes: comment.number_of_likes ?? 0 + 1 }, { populate: "pilot", returnDocument: 'after' });
        }

        if(reply && !reply.dislikes.includes(pilot_id)) {
            await this.commentDislikeModel.create({ pilot_id, comment_id: comment.id });
            return await this.commentReplyModel.findOneAndUpdate({ id }, { number_of_dislikes: comment.number_of_likes ?? 0 + 1 }, { populate: "pilot", returnDocument: 'after' });
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