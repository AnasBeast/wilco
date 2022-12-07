import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/database/mongo/models/post.model';
import { CreateCommentDTO } from 'src/dto/comment/create-comment.dto';
import { BasePost } from 'src/dto/post/base-post.dto';
import { CreatePostDTO } from 'src/dto/post/create-post.dto';
import { CommentService } from '../comments/comments.service';
import { S3Service } from '../files/s3.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name)
        private readonly postsModel: Model<PostDocument>,
        private readonly s3service: S3Service,
        private readonly commentsService: CommentService
      ) {}
    
      async getFeedPosts(page: number, per_page: number, userId: string, feed?: boolean, community_tags?: string[], hashtags?: string[]): Promise<Post[]> {
        if (!feed) {
          return await this.postsModel.find({ creator: userId }, {}, { limit: per_page, skip: page * per_page }).lean().exec();
        }
        return await this.postsModel.find({ post_communities: {$in: community_tags} }, {}, { limit: per_page, skip: page * per_page }).lean().exec();
      }
    
      async findOne(id: string) {
        return await this.postsModel.findById(id);
      }
    
      async create(createTodoDto: CreatePostDTO, userId: string, files?: Express.Multer.File[]): Promise<Post> {
        const postData = {
          ...createTodoDto,
          creator: userId
        }
        
        if (files) {
          const filesArr = await this.s3service.uploadFiles(files);
          postData["post_media"] = filesArr;
        }
        return await this.postsModel.create(postData);
      }
    
      async update(id: string, updateTodoDto: BasePost): Promise<Post> {
        return await this.postsModel.findByIdAndUpdate(id, updateTodoDto).exec();
      }
    
      async delete(id: string): Promise<Post> {
        return await this.postsModel.findByIdAndDelete(id).exec();
      }

      // comments
      async createComment(postId: string, commentInput: CreateCommentDTO, userId: string) {
        const post = await this.postsModel.findById(postId);
        if(!post) throw new BadRequestException();
        if (!commentInput.parentCommentId) {
          const comment = await this.commentsService.createComment({ ...commentInput, creator: userId, post: postId })
          post.number_of_comments++;
          post.comments.push(comment._id);
          return post.save();
        }
        const parentComment = await this.commentsService.getCommentById(commentInput.parentCommentId);
        if(!parentComment) throw new BadRequestException();
        const reply = await this.commentsService.createReply({ ...commentInput, creator: userId, post: postId });
        post.number_of_comments++;
        parentComment.replies.push(reply._id);
        parentComment.save();
        return post.save();
      }

      //get comments
      async getComments(postId: string, userId: string) {
        return await this.commentsService.getCommentsByPostId(postId);
      }
}
