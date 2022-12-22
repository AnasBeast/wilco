import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { CommentLike } from './comment-like.model';
import { CommentDislike } from './comment-dislike.model';

export type CommentDocument = HydratedDocument<Comment> & { likes?: number[], dislikes?: number[] };

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty()
  @Prop({ required: true })
  text: string;

  @ApiProperty()
  @Prop({ required: true })
  pilot_id: number;

  @ApiProperty()
  @Prop({ required: true })
  post_id: number;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_likes: number;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_dislikes: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.virtual("pilot", {
  ref: "Pilot",
  localField: "pilot_id",
  foreignField: "id",
  justOne: true
})

CommentSchema.virtual("likes", {
  ref: "CommentLike",
  localField: "id",
  foreignField: "comment_id",
})

CommentSchema.virtual("dislikes", {
  ref: "CommentDislike",
  localField: "id",
  foreignField: "comment_id",
})

CommentSchema.virtual("replies", {
  ref: "CommentReply",
  localField: "id",
  foreignField: "parent_comment_id",
})
