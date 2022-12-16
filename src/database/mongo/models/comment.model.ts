import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';
import { CommentReply } from './commentReply.model';
import { Post } from './post.model';
import { User } from './user.model';
import { Types } from "mongoose";

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  
  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: User;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: string
  
  @ApiProperty()
  @Prop({ required: true })
  text: string;

  // likes and desliked

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

    // end of likes and desliked


  // mentioned users
  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  mentioned_pilots: User[];
  // mentione users

  //replies
  @ApiProperty()
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CommentReply' }],
    default: [],
  })
  replies: Types.ObjectId[];
  //end of replies


  @ApiProperty()
  @Prop({ default: [] })
  hashtags: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.virtual("pilot", {
  ref: "Pilot",
  localField: ""
})
