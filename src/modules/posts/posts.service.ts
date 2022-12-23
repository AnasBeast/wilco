import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errors } from 'src/common/helpers/responses/error.helper';
import { Like, LikeDocument } from 'src/database/mongo/models/like.model';
import { Post, PostDocument } from 'src/database/mongo/models/post.model';
import { CommentBodyDTO } from 'src/dto/comment/create-comment.dto';
import { BasePost } from 'src/dto/post/base-post.dto';
import { CreatePostDTO } from 'src/dto/post/create-post.dto';
import { CommentService } from '../comments/comments.service';
import { S3Service } from '../files/s3.service';
import { FlightService } from '../flights/flights.service';
import { NotificationsService } from '../notifications/notifications.service';
import { Post_Airports_Service } from '../post_airports/post-airports.service';
import { AirportsService } from '../airports/airports.service';
import { HashtagsService } from '../hashtags/hashtags.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postsModel: Model<PostDocument>,
        private readonly s3service: S3Service,
        private readonly commentsService: CommentService,
        private readonly airportsService: AirportsService,
        private readonly postFlightService: FlightService,
        @InjectModel(Like.name)
        private readonly likeModel: Model<LikeDocument>,
        private readonly notificationService: NotificationsService,
        private readonly hashtagsService: HashtagsService
      ) {}
    
      async getFeedPosts(page: number, per_page: number, pilotId: number, feed: string = 'true', community_tags?: string[], hashtags?: string[]) {
        if (feed === 'false') {
          const posts = await this.postsModel.find({ pilot_id: pilotId }, {}, { limit: per_page, skip: (page - 1) * per_page, populate: [{ path: "pilot" }, { path: "flight", populate: "aircraft"}, { path: "first_comments", populate: "pilot" }]}).sort({ created_at: -1 }).lean();
          const count = await this.postsModel.find({ pilot_id: pilotId }).count();
          return {data: posts, pagination: { current: (page - 1) * per_page + posts.length, pages: Math.ceil(count / per_page), first_page: (page - 1) * per_page === 0, last_page: count < (page - 1) * per_page + per_page }}
        }
        const posts = await this.postsModel.find({ visibility: "public" }, {}, { limit: per_page, skip: (page - 1) * per_page, populate: [{ path: "pilot" }, { path: "flight", populate: "aircraft"}, { path: "first_comments", populate: "pilot" }]}).sort({ created_at: -1 }).lean();
        const count = await this.postsModel.find({ visibility: "public" }).count();
        return {data: posts, pagination: { current: (page - 1) * per_page + posts.length, pages: Math.ceil(count / per_page), first_page: (page - 1) * per_page === 0, last_page: count < (page - 1) * per_page + per_page }}
      }

      async getPublicPostsByPilotId(page, per_page, pilot_id, my_pilot_id) {
        const posts = await this.postsModel.find({ pilot_id, visibility: "public" }, {}, {limit: per_page, skip: (page - 1)* per_page, populate: [{ path: "pilot", select: "-_id -created_at -updated_at" }, { path: 'likes', transform: (doc) => doc?.pilot_id }, { path: "flight", populate: "aircraft"}, { path: "first_comments", populate: "pilot" }, { path: 'hashtags', populate: { path: 'hashtag'  }, transform: (doc) => doc && doc?.hashtag?.text }, {path:"community_tags", populate: { path:"community", }, transform: (doc) => doc && doc?.community?.name }]}).select("-_id -photo_keys").sort({ created_at: -1 }).lean();
        posts.forEach(post => post.likes.includes(my_pilot_id) ? post.liked = true : post.liked = false);
        const count = await this.postsModel.find({ pilot_id, visibility: "public" }).count();
        const pages = Math.ceil(count / per_page);
        return {
          data: posts,
          pagination: {
            current: page,
            pages: pages,
            first_page: page === 1,
            last_page: page === pages || pages === 0
          }
        }
      }
    
      async getPostById(id: number, pilotId: number) {
        const post = await this.postsModel.findOne({ id }, {}, { populate: [{ path: 'pilot', select: "-_id -__v -created_at -updated_at -updatedAt -profile_picture_key"}, { path: "likes", transform: (doc) => doc?.pilot_id }, { path: "flight", populate: "aircraft"}, { path: "first_comments", populate: "pilot" }, { path: 'hashtags', populate: { path: 'hashtag'  }, transform: (doc) => doc && doc?.hashtag?.text }, {path:"community_tags", populate: { path:"community", }, transform: (doc) => doc && doc?.community?.name }] }).select("-_id -__v").lean()
        if (post.likes.includes(pilotId)) {
          post.liked = true;
        } else {
          post.liked = false;
        }
        if(post.visibility !== "public" && post.pilot_id !== pilotId) {
          throw new ForbiddenException(errors.PERMISSION_DENIED);
        }
        return post;
      }
    
      async create(createTodoDto: CreatePostDTO, pilot_id: string) {
        const postData = {
          ...createTodoDto.post,
          pilot_id
        }
        
        let photo_keys = []
        let photo_preview_urls = []
        if (postData.photos) {
          const filesArr = await this.s3service.uploadFiles(postData.photos);
          filesArr.map((photo) => {
            photo_keys.push(photo.key);
            photo_preview_urls.push(photo.location);
          })
        }

        let airports = []
        if (postData.airports) {
          airports = await this.airportsService.getAirportsByFilter({ icao: { $in: postData.airports } }, ["icao", "lat", "lon", "-_id"]);
        }

        if (postData.flight) {
          this.postFlightService.createPostFlight(postData.flight);
        }

        return await this.postsModel.create({  ...postData, photo_keys, photo_preview_urls, airports });
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
          const like = await this.likeModel.create({ pilot_id, post_id: post.id });
          await this.notificationService.pushNotification("Like", like.id, post.pilot_id, 1);
          const updatedPost = await this.postsModel.findByIdAndUpdate(post._id, { number_of_likes: post.number_of_likes + 1 }, { returnDocument: 'after' }).lean();
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
        const updatedPost = await this.postsModel.findByIdAndUpdate(post._id, { number_of_likes: post.number_of_likes - 1 }, { returnDocument: 'after' }).lean();
        return { ...updatedPost, liked: false }
      }

      // comments
      async createComment(id: string, commentInput: CommentBodyDTO, pilot_id: number) {
        const post = await this.postsModel.findOne({ id }).lean();
        if(!post) throw new NotFoundException();
        if (!commentInput.parent_comment_id) {
          const comment = await this.commentsService.createComment({ ...commentInput, pilot_id, post_id: post.id });
          const updatedPost = await this.postsModel.findOneAndUpdate({ id }, { number_of_comments: post.number_of_comments + 1 }).lean();
          const populatedComment = await this.commentsService.getCommentById(comment.id);
          return { ...populatedComment, post: updatedPost };
        }
        const parentComment = await this.commentsService.getCommentById(commentInput.parent_comment_id);
        if(!parentComment) throw new NotFoundException();
        const reply = await this.commentsService.createReply({ ...commentInput, pilot_id, post_id: post.id });
        const updatedPost = await this.postsModel.findOneAndUpdate({ id }, { number_of_comments: post.number_of_comments + 1 }).lean();
        const populatedComment = await this.commentsService.getCommentById(reply.id);
        return { ...populatedComment, post: updatedPost };
      }

      //get comments
      async getComments(id: string, page: number, per_page: number, pilot_id: number) {
        if(isNaN(+id)) throw new BadRequestException("post_id should be a number");
        const post = await this.postsModel.findOne({ id: +id });
        if(!post) throw new NotFoundException(errors.POST_NOT_FOUND);
        if(post.visibility === "only_me" && post.pilot_id !== pilot_id) throw new UnauthorizedException(errors.PERMISSION_DENIED);
        const comments = await this.commentsService.getCommentsByPostId(+id, page, per_page);
        const count = await this.commentsService.getCommentsCountByPostId(id);
        const pages = Math.ceil(count / per_page)
        return await { data: comments, pagination: { current: page, pages, first_page: (page - 1) * per_page === 0, last_page: page === pages } }
      }
}
