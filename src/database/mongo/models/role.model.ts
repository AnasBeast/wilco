import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @ApiProperty()
  @Prop({ unique: true, required: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
