import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Schema as MongooseSchema } from 'mongoose';
import { AirCraft } from './airCraft.model';
import { Airport } from './airport.model';

export type FlightDocument = Flight & Document;

@Schema({ timestamps: true })
export class Flight {
  @ApiProperty()
  @Prop({ required: true })
  from: string;

  @ApiProperty()
  @Prop({ required: true })
  to: string;

  @ApiProperty()
  @Prop({ required: true })
  departure_date: Date;

  @ApiProperty()
  @Prop({ required: true })
  arrival_date: Date;

  @ApiProperty()
  @Prop({ required: true })
  distance: number;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AirCraft', required: false })
  airCraft: AirCraft;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Airport' })
  airportPath: Airport;
}

export const FlightSchema = SchemaFactory.createForClass(Flight);
