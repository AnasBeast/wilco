import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AirportDocument = Airport & Document;

@Schema({ timestamps: true })
export class Airport {
  @ApiProperty()
  @Prop({ required: true })
  name: string;
}

export const AirportSchema = SchemaFactory.createForClass(Airport);
