import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema()
export class Certificate {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name?: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
