import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { AirCraftEntity } from 'src/common/entities/airCraft.entity';
import { AirportEntity } from 'src/common/entities/airport.entity';
import { CommunityEntity } from 'src/common/entities/community.entity';
import { RoleEntity } from 'src/common/entities/role.entity';
import { Types } from "mongoose";

export type PilotDocument = HydratedDocument<Pilot>;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Pilot {  
  @ApiProperty()
  @Prop({ required: true })
  first_name: string;

  @ApiProperty()
  @Prop({ required: true })
  last_name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop({ required: true, select: false })
  roles_ids: number[]
  
  @ApiProperty()
  @Prop({})
  primary_aircraft_id: number;

  @ApiProperty()
  @Prop()
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
  @Prop()
  home_airport: string;

  @ApiProperty()
  @Prop({ default: [] })
  airports: string[];

  @ApiProperty()
  @Prop()
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
  autopopulate: true
})

PilotSchema.virtual('ratings', {
  ref: 'Rating',
  localField: 'rating_ids',
  foreignField: 'id',
  autopopulate: true
})



