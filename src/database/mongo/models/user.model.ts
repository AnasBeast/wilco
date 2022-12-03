import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { AirCraftEntity } from 'src/common/entities/airCraft.entity';
import { AirportEntity } from 'src/common/entities/airport.entity';
import { CommunityEntity } from 'src/common/entities/community.entity';
import { RoleEntity } from 'src/common/entities/role.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop()
  first_name: string;

  @ApiProperty()
  @Prop()
  last_name: string;

  @ApiProperty()
  @Prop()
  firebase_uid: string;

  @ApiProperty()
  @Prop()
  banner: string;

  @ApiProperty()
  @Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Role',
    required: true,
  })
  roles: RoleEntity[]

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Airport',
  })
  home_airport: AirportEntity;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Airport',
  })
  aircrafts: AirCraftEntity[];

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Airport',
  })
  primary_aircraft: AirCraftEntity;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Community',
  })
  communities: CommunityEntity[];

  @ApiProperty()
  @Prop()
  total_hours: number;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  // @ApiProperty()
  // @Prop()
  // cometchat_auth_token: string;

  @ApiProperty()
  @Prop()
  profile_picture_link: string;

  @ApiProperty()
  @Prop()
  profile_picture_key: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
