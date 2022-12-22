import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post, {}, { likes: number[] }>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }, toJSON: { virtuals: true }, toObject: { virtuals: true } })
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
  @Prop({ required: true, enum: ["public", "only_me"] })
  visibility: string;

  @ApiProperty()
  @Prop({ required: true })
  pilot_id: number;

  @ApiProperty()
  @Prop({ default: [] })
  photo_keys: string[];

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
  justOne: true
})

PostSchema.virtual('flight', {
  ref: 'Post_Flights',
  localField: 'id',
  foreignField: 'post_id',
  justOne: true
})

PostSchema.virtual('first_comments', {
  ref: 'Comment',
  localField: 'id',
  foreignField: 'post_id'
})

PostSchema.virtual('likes', {
  ref: 'Like',
  localField: 'id',
  foreignField: 'post_id'
})
