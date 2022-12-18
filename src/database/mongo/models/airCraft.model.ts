import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AirCraftDocument = HydratedDocument<AirCraft>;

@Schema({ timestamps: true })
export class AirCraft {
  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.Number, ref: 'Pilot', required: true })
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
  @Prop({ select: false })
  aircraft_picture_key?: string;

  @ApiProperty()
  @Prop({ default: false, select: false })
  removed?: boolean;
}

export const AirCraftSchema = SchemaFactory.createForClass(AirCraft);
