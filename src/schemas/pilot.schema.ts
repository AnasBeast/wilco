import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';
import { Role } from 'src/database/mongo/models/role.model';
import { Certificate } from './certificate.schema';
import { PostFlight } from './post-flight.schema';

export type PilotDocument = Pilot & Document;

@Schema()
export class Pilot {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  primary_aircraft_id: number;

  @Prop({ required: true })
  profile_picture_url: string;

  @Prop({ required: false })
  latest_flights: PostFlight;

  @Prop({ required: false })
  aircrafts: AirCraft;

  @Prop({ required: false })
  certificates: Certificate;

  @Prop({ required: false })
  ratings: string; // TODO by AWAIS

  @Prop({ required: false })
  community_tags: string;

  @Prop({ required: false })
  roles: Role; // TODO by AWAIS

}

export const PilotSchema = SchemaFactory.createForClass(Pilot);
