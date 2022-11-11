import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';
import { CommentReply } from './commentReply.model';
import { Post } from './post.model';
import { User } from './user.model';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty()
  @Prop({ required: true })
  text: string;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  pilot: User;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

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
  likes: User[];

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  dislikes: User[];

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  mentioned_pilots: User[];

  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CommentReply' }],
    default: [],
  })
  replies: CommentReply[];

  @ApiProperty()
  @Prop({ default: [] })
  hashtags: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
