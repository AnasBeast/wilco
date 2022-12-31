import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Query } from 'mongoose';

export type PostDocument = HydratedDocument<Post, {}, { likes: number[], liked: boolean }>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'edited_at' }, toJSON: { virtuals: true, transform: true }, toObject: { virtuals: true, transform: true } })
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
  photo_urls: string[];

  @ApiProperty()
  @Prop({ default: [] })
  photo_preview_urls: string[];

  @ApiProperty()
  @Prop({ default: [] })
  airports: [];
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.post("find", function(docs) {
  docs.map(doc => doc.photo_urls = doc.photo_preview_urls);
})

PostSchema.post(["findOne", "findOneAndUpdate"], function(doc) {
  doc.photo_urls = doc.photo_preview_urls;
})

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

PostSchema.virtual('hashtags', {
  ref: 'Post_Hashtags',
  localField: 'id',
  foreignField: 'post_id'
})

PostSchema.virtual('community_tags', {
  ref: 'Community_tags',
  localField: 'id',
  foreignField: 'taggable_id',
  match: { taggable_type: "Post" }
})
