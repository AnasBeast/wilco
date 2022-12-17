import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema({ timestamps: true })
export class Like {
  @ApiProperty()
  @Prop({ required: true })
  pilot_id: number;

  @ApiProperty()
  @Prop({ required: true })
  post_id: number;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
