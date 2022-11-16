import { Airport } from 'src/database/mongo/models/airport.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.model';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop()
  cometchat_auth_token: string;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Role',
    required: true,
  })
  role: Role;

  @ApiProperty()
  @Prop()
  profile_picture_link: string;

  @ApiProperty()
  @Prop()
  profile_picture_key: string;

  @ApiProperty()
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Airport',
  })
  home_airport: Airport;
}

export const UserSchema = SchemaFactory.createForClass(User);
