import { UserEntity } from './user.entity';
import { ObjectId } from 'mongoose';
import { PostEntity } from './post.entity';

export class LikeEntity {
  id?: ObjectId;
  post: PostEntity;
  pilot: UserEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
