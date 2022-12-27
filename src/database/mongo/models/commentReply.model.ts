import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type CommentReplyDocument = HydratedDocument<CommentReply> & { likes?: number[], dislikes?: number[] };

@Schema({ timestamps: true })
export class CommentReply {

  @ApiProperty()
  @Prop({ required: true })
  text: string;

  @ApiProperty()
  @Prop({ required: true })
  post_id: number;

  @ApiProperty()
  @Prop({ required: true })
  pilot_id: number;
  
  @ApiProperty()
  @Prop({ required: true })
  parent_comment_id: number;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_likes: number;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_dislikes: number;
}

export const CommentReplySchema = SchemaFactory.createForClass(CommentReply);

CommentReplySchema.virtual("pilot", {
  ref: "Pilot",
  localField: "pilot_id",
  foreignField: "id",
  justOne: true
})

CommentReplySchema.virtual("likes", {
  ref: "CommentLike",
  localField: "id",
  foreignField: "comment_id",
})

CommentReplySchema.virtual("dislikes", {
  ref: "CommentDislike",
  localField: "id",
  foreignField: "comment_id",
})