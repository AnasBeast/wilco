import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { compare, genSalt, hash } from "bcrypt";
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { AirCraftEntity } from 'src/common/entities/airCraft.entity';
import { AirportEntity } from 'src/common/entities/airport.entity';
import { CommunityEntity } from 'src/common/entities/community.entity';
import { RoleEntity } from 'src/common/entities/role.entity';
import { Airport } from 'src/database/mongo/models/airport.model';
import { Community } from 'src/schemas/community.schema';
import { AirCraft } from './airCraft.model';
import { Role } from './role.model';

export type UserDocument = HydratedDocument<User> & {
  comparePassword(candidatePassword: string): Promise<boolean>;
};

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
    ref: 'Airport',
  })
  communities: CommunityEntity[];

  @ApiProperty()
  @Prop()
  total_hours: number;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

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

UserSchema.pre("save", async function(this: UserDocument, next: Function) {
  const user = this;

  if(!user.isModified("password")) return next();

  const salt = await genSalt();

  const hashedPassword = await hash(user.password, salt);

  user.password = hashedPassword;

  return next();
})

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as UserDocument;

  return compare(candidatePassword, user.password).catch((_) => false);
}
