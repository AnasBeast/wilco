import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CommunityDocument = Community & Document;

@Schema()
export class Community {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
