import { User } from './user.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { Comment } from './comment.model';
import { Like } from './like.model';
import { Community } from './community.model';
import { Contribution } from './contribution.model';

export type PostDocument = Post & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Post {
  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop({ required: true })
  text: string;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_likes: number;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_comments: number;

  @ApiProperty()
  @Prop({ default: false })
  liked: boolean;

  @ApiProperty()
  @Prop({ required: true })
  visibility: string;

  @ApiProperty()
  @Prop({ required: true })
  pilot_id: number;

  @ApiProperty()
  @Prop({ default: [] })
  photo_urls: string[];

  @ApiProperty()
  @Prop({ default: [] })
  photo_preview_urls: string[];

  @ApiProperty()
  @Prop({ default: [] })
  community_tags: string[];

  @ApiProperty()
  @Prop({ default: [] })
  airports: string[];

  @ApiProperty()
  @Prop({ default: [] })
  hashtags: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('pilot', {
  ref: 'Pilot',
  localField: 'pilot_id',
  foreignField: 'id',
  justOne: true,
  autopopulate: true
})

PostSchema.virtual('flight', {
  ref: 'Post_Flights',
  localField: 'id',
  foreignField: 'post_id',
  justOne: true,
  autopopulate: true
})

PostSchema.virtual('first_comments', {
  ref: 'Comment',
  localField: 'id',
  foreignField: 'post_id',
  autopopulate: true
})
