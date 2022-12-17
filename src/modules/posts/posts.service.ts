import { ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errors } from 'src/common/helpers/responses/error.helper';
import { Post, PostDocument } from 'src/database/mongo/models/post.model';
import { CreateCommentDTO } from 'src/dto/comment/create-comment.dto';
import { BasePost } from 'src/dto/post/base-post.dto';
import { CreatePostDTO } from 'src/dto/post/create-post.dto';
import { CommentService } from '../comments/comments.service';
import { S3Service } from '../files/s3.service';
import { FlightService } from '../flights/flights.service';
import { Post_Airports_Service } from '../post_airports/post-airports.service';
import { Like, LikeDocument } from 'src/database/mongo/models/like.model';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postsModel: Model<PostDocument>,
        private readonly s3service: S3Service,
        private readonly commentsService: CommentService,
        private readonly postAirportsService: Post_Airports_Service,
        private readonly postFlightService: FlightService,
        @InjectModel(Like.name)
        private readonly likeModel: Model<LikeDocument>
      ) {}
    
      async getFeedPosts(page: number, per_page: number, pilotId: number, feed: boolean = true, community_tags?: string[], hashtags?: string[]) {
        if (!feed) {
          const posts = await this.postsModel.find({ pilot_id: pilotId }, {}, { limit: per_page, skip: (page - 1) * per_page, populate: [{ path: "pilot" }, { path: "flight", populate: "aircraft"}, { path: "first_comments", populate: "pilot" }]}).lean();
          const count = await this.postsModel.find({ pilot_id: pilotId }).count();
          return {data: posts, pagination: { current: (page - 1) * per_page + posts.length, pages: Math.ceil(count / per_page), first_page: (page - 1) * per_page === 0, last_page: count < (page - 1) * per_page + per_page }}
        }
        const posts = await this.postsModel.find({ visibility: "public" }, {}, { limit: per_page, skip: (page - 1) * per_page, populate: [{ path: "pilot" }, { path: "flight", populate: "aircraft"}, { path: "first_comments", populate: "pilot" }]}).lean();
        const count = await this.postsModel.find({ visibility: "public" }).count();
        return {data: posts, pagination: { current: (page - 1) * per_page + posts.length, pages: Math.ceil(count / per_page), first_page: (page - 1) * per_page === 0, last_page: count < (page - 1) * per_page + per_page }}
      }
    
      async getPostById(id: number, pilotId: number) {
        const post = await this.postsModel.findOne({ id }, {}, { populate: [{ path: 'pilot', populate: "aircrafts certificates ratings community_tags roles" }, { path: 'flight', populate: "aircraft" }] });
        if(post.visibility !== "public" && post.pilot_id !== pilotId) {
          throw new ForbiddenException(errors.PERMISSION_DENIED);
        }
        return post;
      }
    
      async create(createTodoDto: CreatePostDTO, pilot_id: string): Promise<Post> {
        const postData = {
          ...createTodoDto.post,
          pilot_id
        }
        
        if (postData.photos) {
          const filesArr = await this.s3service.uploadFiles(postData.photos);
          postData.photos = filesArr;
        }

        if (postData.flight) {
          this.postFlightService.createPostFlight(postData.flight);
        }

        return await this.postsModel.create(postData);
      }
    
      async update(id: string, updateTodoDto: BasePost): Promise<Post> {
        return await this.postsModel.findByIdAndUpdate(id, updateTodoDto).exec();
      }
    
      async delete(id: string): Promise<Post> {
        return await this.postsModel.findByIdAndDelete(id).exec();
      }

      async likePost(id: string, pilot_id: number) {
        const post = await this.postsModel.findOne({ id }, {}, { populate: { path: "likes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();
        if(!post) {
          throw new NotFoundException();
        }
        if(!post.likes.includes(pilot_id)) {
          await this.likeModel.create({ pilot_id, post_id: post.id });
          const updatedPost = await this.postsModel.findByIdAndUpdate(post._id, { number_of_likes: post.number_of_likes + 1 }, { returnDocument: 'after' });
          return { ...updatedPost, liked: true }
        } else {
          throw new UnprocessableEntityException();
        }
      }

      async unlikePost(id: string, pilot_id: number) {
        const post = await this.postsModel.findOne({ id }, {}, { populate: { path: "likes", match: { pilot_id }, transform: (doc) => doc == null ? null : doc.pilot_id } }).lean();
        if(!post || !post.likes.includes(pilot_id)) {
          throw new NotFoundException();
        }
        await this.likeModel.findOneAndDelete({ pilot_id, post_id: post.id });
        const updatedPost = await this.postsModel.findByIdAndUpdate(post._id, { number_of_likes: post.number_of_likes - 1 }, { returnDocument: 'after' });
        return { ...updatedPost, liked: false }
      }

      // comments
      async createComment(postId: string, commentInput: CreateCommentDTO, userId: string) {
        // const post = await this.postsModel.findById(postId);
        // if(!post) throw new BadRequestException();
        // if (!commentInput.parentCommentId) {
        //   const comment = await this.commentsService.createComment({ ...commentInput, creator: userId, post: postId })
        //   post.number_of_comments++;
        //   post.comments.push(comment._id);
        //   return post.save();
        // }
        // const parentComment = await this.commentsService.getCommentById(commentInput.parentCommentId);
        // if(!parentComment) throw new BadRequestException();
        // const reply = await this.commentsService.createReply({ ...commentInput, creator: userId, post: postId });
        // post.number_of_comments++;
        // parentComment.replies.push(reply._id);
        // parentComment.save();
        // return post.save();
      }

      //get comments
      async getComments(postId: string, page: number, per_page: number, pilotId: number) {
        const post = await this.postsModel.findById(postId);
        if(!post) throw new NotFoundException(errors.POST_NOT_FOUND);
        if (post.visibility !== "public" && post)
        return await this.commentsService.getCommentsByPostId(postId, pilotId);
      }
}
