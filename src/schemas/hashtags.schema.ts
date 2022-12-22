import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HashtagsDocument = Hashtags & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true, transform: true }, toObject: { virtuals: true, transform: true } })
export class Hashtags {
  @Prop({ required: true, unique: true })
  text: string;
}

export const HashtagsSchema = SchemaFactory.createForClass(Hashtags);

HashtagsSchema.index({ name: 'text', 'text': 'text' });
