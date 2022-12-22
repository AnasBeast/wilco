import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Pilot_Certificates {
    @Prop({ required: true })
    pilot_id: number;

    @Prop({ required: true })
    certificate_id: number;
}

export const PilotCertificatesSchema = SchemaFactory.createForClass(Pilot_Certificates);

PilotCertificatesSchema.virtual("certificate", {
    ref: 'Certificate',
    localField: 'certificate_id',
    foreignField: 'id',
    justOne: true,
})