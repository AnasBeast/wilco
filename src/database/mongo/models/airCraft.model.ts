import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AirCraftDocument = AirCraft & Document;

@Schema({ timestamps: true })
export class AirCraft {
  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  pilot_id: Types.ObjectId

  @ApiProperty()
  @Prop({ required: true })
  make_and_model: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  tail_number: string;

  @ApiProperty()
  @Prop()
  aicraft_picture?: string;

  @ApiProperty()
  @Prop()
  aircraft_picture_key?: string;
}

export const AirCraftSchema = SchemaFactory.createForClass(AirCraft);
