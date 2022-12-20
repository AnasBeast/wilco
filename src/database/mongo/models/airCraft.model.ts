import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type AirCraftDocument = HydratedDocument<AirCraft>;

@Schema({ timestamps: true })
export class AirCraft {
  @ApiProperty()
  @Prop({ required: true })
  pilot_id: number

  @ApiProperty()
  @Prop({ required: true })
  make_and_model: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  tail_number: string;

  @ApiProperty()
  @Prop({ default: null })
  aicraft_picture?: string;

  @ApiProperty()
  @Prop({ select: false })
  aircraft_picture_key?: string;

  @ApiProperty()
  @Prop({ default: false, select: false })
  removed?: boolean;
}

export const AirCraftSchema = SchemaFactory.createForClass(AirCraft);
