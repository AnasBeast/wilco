import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { AirCraft } from './airCraft.model';

export type PilotDocument = HydratedDocument<Pilot, {}, { aircrafts?: (AirCraft & { id: number })[] }>;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Pilot {    
  @ApiProperty()
  @Prop({ required: true })
  first_name: string;

  @ApiProperty()
  @Prop({ required: true })
  last_name: string;

  @ApiProperty()
  @Prop({ default: null })
  description: string;

  @ApiProperty()
  @Prop({ required: true, select: false })
  roles_ids: number[]
  
  @ApiProperty()
  @Prop({ default: null })
  primary_aircraft_id: number;

  @ApiProperty()
  @Prop({ default: null })
  profile_picture_url: string;

  @ApiProperty()
  @Prop({ default: null })
  home_airport: string;

  @ApiProperty()
  @Prop({ default: [] })
  airports: string[];

  @ApiProperty()
  @Prop({ default: null })
  total_hours: string;

  @Prop({ select: false })
  profile_picture_key: string;
}


export const PilotSchema = SchemaFactory.createForClass(Pilot);

PilotSchema.virtual('aircrafts', {
  ref: 'AirCraft',
  localField: 'id',
  foreignField: 'pilot_id'
}) 

PilotSchema.virtual('certificates', {
  ref: 'Pilot_Certificates',
  localField: 'id',
  foreignField: 'pilot_id'
})

PilotSchema.virtual('roles', {
  ref: 'Pilot_Roles',
  localField: 'id',
  foreignField: 'pilot_id'
})

PilotSchema.virtual('ratings', {
  ref: 'Pilot_Ratings',
  localField: 'id',
  foreignField: 'pilot_id'
})

PilotSchema.virtual('community_tags', {
  ref: 'Community_tags',
  localField: 'id',
  foreignField: 'taggable_id',
  match: { taggable_type: "Pilot" }
})



