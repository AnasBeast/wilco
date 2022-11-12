import { CommunityEntity } from './community.entity';
import { UserEntity } from './user.entity';
import { FlightEntity } from './flight.entity';
import { CommentEntity } from './comment.entity';
import { ObjectId } from 'mongoose';
import { ContributionEntity } from './contribution.entity';
import { LikeEntity } from './like.entity';

export class PostEntity {
  id?: ObjectId;
  text: string;
  title: string;
  post_type: string;
  visibility: string;
  number_of_likes: number;
  number_of_comments: number;
  post_media: string[];
  comments: CommentEntity[];
  Likes: LikeEntity[];
  flight_info: FlightEntity;
  mentioned_pilots: UserEntity[];
  post_communities: CommunityEntity[];
  contribution: ContributionEntity;
  creator: UserEntity;
  createdAt?: Date;
  updatedAt?: Date;
}
