import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  @Prop()
  firebase_uid: string;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  @ApiProperty()
  @Prop()
  pilot_id: number;

  @ApiProperty()
  @Prop()
  cometchat_auth_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('pilot', {
  ref: 'Pilot',
  localField: 'pilot_id',
  foreignField: 'id',
  justOne: true,

})
