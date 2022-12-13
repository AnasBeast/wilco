import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceDocument = Device & Document;

@Schema()
export class Device {
  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  token: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
