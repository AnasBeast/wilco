import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { bool } from 'aws-sdk/clients/signer';

export type AirCraftDocument = AirCraft & Document;

@Schema({ timestamps: true })
export class AirCraft {
  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.Number, ref: 'Pilot', required: true,  })
  pilot_id: number

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

  @ApiProperty()
  @Prop({ default: false })
  removed?: boolean;
}

export const AirCraftSchema = SchemaFactory.createForClass(AirCraft);
