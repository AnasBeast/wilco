import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CommunityDocument = Community & Document;

@Schema({ timestamps: true })
export class Community {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty()
  @Prop({ default: 0 })
  pilot_number: number;
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
