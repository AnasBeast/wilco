import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CommunityDocument = Community & Document;

@Schema()
export class Community {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name?: string;

}

export const CommunitySchema = SchemaFactory.createForClass(Community);