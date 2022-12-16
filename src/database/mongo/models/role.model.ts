import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Role {
  @ApiProperty()
  @Prop({ unique: true, required: true })
  name: string;

  @ApiProperty()
  @Prop({ default: true })
  custom: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

