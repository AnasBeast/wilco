import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HashtagsDocument = Hashtags & Document;

@Schema()
export class Hashtags {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  text: string;
}

export const HashtagsSchema = SchemaFactory.createForClass(Hashtags);

HashtagsSchema.index({ name: 'text', 'text': 'text' })
