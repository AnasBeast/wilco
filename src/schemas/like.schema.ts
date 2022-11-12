import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Pilot } from './pilot.schema';
import { Post } from './post.schema';

export type LikeDocument = Like & Document;

@Schema()
export class Like {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  post_id: number;

  @Prop({ required: true })
  pilot: Pilot;

  @Prop({ required: true })
  post: Post;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
