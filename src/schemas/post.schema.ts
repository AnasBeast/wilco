import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Pilot } from './pilot.schema';
import { PostFlight } from './post-flight.schema';

export type PostDocument = Post & Document;

enum Visiblity {
    public, 
    only_me
}

@Schema()
export class Post {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  created_at: string;

  @Prop({ required: true })
  edited_at: string;

  @Prop({ required: true })
  number_of_likes: number;

  @Prop({ required: true })
  number_of_comments: number;

  @Prop({ required: true })
  liked: boolean;

  @Prop({ required: true })
  visibility: Visiblity;

  @Prop({ required: false })
  pilot: Pilot;

  @Prop({ required: false })
  flight: PostFlight;

  @Prop({ required: true, nullable: true })
  photo_urls: string;

  @Prop({ required: true, nullable: true })
  photo_preview_urls: string;

  @Prop({ required: true, nullable: true })
  photo_ids: string;

  @Prop({ required: false })
  community_tags: string;

  @Prop({ required: false })
  airports: string;

  @Prop({ required: false })
  hashtags: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
