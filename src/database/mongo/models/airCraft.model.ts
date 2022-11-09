import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AirCraftDocument = AirCraft & Document;

@Schema({ timestamps: true })
export class AirCraft {
  @ApiProperty()
  @Prop({ required: true })
  make_and_model: string;

  @ApiProperty()
  @Prop({ required: true })
  tail_number: string;

  @ApiProperty()
  @Prop({ required: true })
  aicraft_picture: string;

  @ApiProperty()
  @Prop({ required: true })
  aircraft_picture_key: string;
}

export const AirCraftSchema = SchemaFactory.createForClass(AirCraft);
