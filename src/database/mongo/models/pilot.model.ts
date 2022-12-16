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
  @Prop({ default: [], select: false })
  certificate_ids: number[];

  @ApiProperty()
  @Prop({ default: [], select: false })
  rating_ids: number[];

  @ApiProperty()
  @Prop({ default: [] })
  communities_tags: string[];

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
  foreignField: 'pilot_id',
  autopopulate: true
}) 

PilotSchema.virtual('certificates', {
  ref: 'Certificate',
  localField: 'certificate_ids',
  foreignField: 'id',
  autopopulate: true
})

PilotSchema.virtual('roles', {
  ref: 'Role',
  localField: 'roles_ids',
  foreignField: 'id',
  autopopulate: true,
})

PilotSchema.virtual('ratings', {
  ref: 'Rating',
  localField: 'rating_ids',
  foreignField: 'id',
  autopopulate: true
})



