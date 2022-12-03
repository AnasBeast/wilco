import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AirportDocument = Airport & Document;

@Schema({ timestamps: true })
export class Airport {
  @ApiProperty()
  @Prop({ unique: true, required: true })
  name: string;

  @ApiProperty()
  @Prop({ unique: true, required: true })
  icao: string;
}

export const AirportSchema = SchemaFactory.createForClass(Airport);
