import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';

export type PostFlightDocument = PostFlight & Document;

@Schema()
export class PostFlight {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  departure_time: string;

  @Prop({ required: true })
  arrival_time: string;

  @Prop({ required: true })
  max_speed: number;

  @Prop({ required: true })
  max_altitude: number;

  @Prop({ required: true })
  distance: number;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  aircraft: AirCraft;

  @Prop({ required: true })
  track_url: string;

}

export const PostFlightSchema = SchemaFactory.createForClass(PostFlight);
