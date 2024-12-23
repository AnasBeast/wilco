import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Date } from 'mongoose';


export type FlightDocument = Post_Flights & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Post_Flights {
  @ApiProperty()
  @Prop({ required: true })
  from: string;

  @ApiProperty()
  @Prop({ required: true })
  to: string;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  departure_time: string;

  @ApiProperty()
  @Prop({ required: true, type: Date })
  arrival_time: string;

  @ApiProperty()
  @Prop({ required: true })
  max_speed: number

  @ApiProperty()
  @Prop({ required: true })
  max_altitude: number

  @ApiProperty()
  @Prop({ required: true })
  distance: number;

  @ApiProperty()
  @Prop({ required: true })
  aircraft_id: number;

  @ApiProperty()
  @Prop({ required: true })
  post_id: number;

  @ApiProperty()
  @Prop()
  track_url: string;
}

export const FlightSchema = SchemaFactory.createForClass(Post_Flights);

FlightSchema.virtual('aircraft', {
  ref: 'AirCraft',
  localField: 'aircraft_id',
  foreignField: 'id',
  justOne: true
})
