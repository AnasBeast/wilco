import { User } from './user.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';
import { Comment } from './comment.model';
import { Flight } from './flight.model';
import { Like } from './like.model';
import { Community } from './community.model';
import { Contribution } from './contribution.model';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  message: string;

  @ApiProperty()
  @Prop({ default: [] })
  post_media: string[];

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Flight' })
  flight_info: Flight;

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Community' }],
    default: [],
  })
  post_communities: Community[];

  @ApiProperty()
  @Prop({ required: true })
  visibility: string;

  @ApiProperty()
  @Prop({ required: true })
  post_type: string;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_likes: number;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_comments: number;

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  comments: Comment[];

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Like' }],
    default: [],
  })
  Likes: Like[];

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  mentioned_users: User[];

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Contribution' })
  contribution: Contribution;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
