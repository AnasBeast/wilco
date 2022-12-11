import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { AirCraftEntity } from 'src/common/entities/airCraft.entity';
import { AirportEntity } from 'src/common/entities/airport.entity';
import { CommunityEntity } from 'src/common/entities/community.entity';
import { RoleEntity } from 'src/common/entities/role.entity';
import { Types } from "mongoose";

export type PilotDocument = HydratedDocument<Pilot>;

@Schema({ timestamps: true })
export class Pilot {
  @ApiProperty()
  @Prop()
  id: number;

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
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Role',
    required: true,
    autopopulate: true
  })
  roles: Types.ObjectId[]
  
  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Aircraft',
  })
  primary_aircraft_id: Types.ObjectId;

  @ApiProperty()
  @Prop()
  profile_picture_url: string;

  @ApiProperty()
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Flight',
    autopopulate: true
  })
  latest_flights: Types.ObjectId[]

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Aircraft',
    autopopulate: true
  })
  aircrafts: Types.ObjectId[];

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Certificate',
    autopopulate: true
  })
  certificates: Types.ObjectId[];

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Rating',
    autopopulate: true
  })
  ratings: Types.ObjectId[];

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Community',
    autopopulate: true
  })
  community_tags: Types.ObjectId[];

  @ApiProperty()
  @Prop()
  home_airport: string;

  @ApiProperty()
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Airport',
    autopopulate: true
  })
  airports: Types.ObjectId[];

  @ApiProperty()
  @Prop()
  total_hours: number;

  @Prop()
  profile_picture_key: string;
}


export const PilotSchema = SchemaFactory.createForClass(Pilot);
