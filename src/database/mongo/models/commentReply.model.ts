import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { User } from './user.model';

export type CommentReplyDocument = CommentReply & Document;

@Schema({ timestamps: true })
export class CommentReply {
  
  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: User;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: string
  
  @ApiProperty()
  @Prop({ required: true })
  text: string;

  //parent comment
  @ApiProperty()
  @Prop({ required: true })
  parentCommentId: Types.ObjectId;

  // likes and deslikes
  @ApiProperty()
  @Prop({ default: 0 })
  number_of_likes: number;

  @ApiProperty()
  @Prop({ default: 0 })
  number_of_dislikes: number;

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: Types.ObjectId[];

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  dislikes: Types.ObjectId[];

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  mentioned_pilots: User[];

  @ApiProperty()
  @Prop({ default: [] })
  hashtags: string[];
}

export const CommentReplySchema = SchemaFactory.createForClass(CommentReply);
