import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
    @Prop({ required: true, type: String, enum: ['Post', 'Comment', 'Pilot'] })
    reportable_type: string;

    @Prop({ required: true })
    reportable_id: number;
}

export const ReportSchema = SchemaFactory.createForClass(Report);