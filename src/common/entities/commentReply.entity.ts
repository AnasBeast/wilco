import { CommentEntity } from './comment.entity';
import { ObjectId } from 'mongoose';
import { UserEntity } from './user.entity';

export class CommentReplyEntity {
  id?: ObjectId;
  text: string;
  number_of_likes: number;
  number_of_dislikes: number;
  pilot: UserEntity;
  comment: CommentEntity;
  likes: UserEntity[];
  dislikes: UserEntity[];
  mentioned_pilots: UserEntity[];
  hashtags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
