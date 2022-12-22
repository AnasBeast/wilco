import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Certificate {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
