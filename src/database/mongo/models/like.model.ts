import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';
import { Post } from './post.model';
import { User } from './user.model';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  pilot: User;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
