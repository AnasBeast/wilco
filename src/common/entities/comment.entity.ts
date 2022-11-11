import { CommentReplyEntity } from './commentReply.entity';
import { ObjectId } from 'mongoose';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

export class CommentEntity {
  id?: ObjectId;
  text: string;
  number_of_likes: number;
  number_of_dislikes: number;
  pilot: UserEntity;
  post: PostEntity;
  comment: string;
  likes: UserEntity[];
  dislikes: UserEntity[];
  mentioned_pilots: UserEntity[];
  replies: CommentReplyEntity[];
  hashtags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
