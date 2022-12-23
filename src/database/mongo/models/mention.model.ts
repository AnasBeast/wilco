import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MentionDocument = HydratedDocument<Mention>;

@Schema({ timestamps: true })
export class Mention {
    @Prop({ required: true })
    pilot_id: number;

    @Prop({ required: true })
    post_id: number;

    @Prop({ required: true })
    mentioned_pilot_id: number;
}

export const MentionSchema = SchemaFactory.createForClass(Mention);