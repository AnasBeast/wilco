import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
    @Prop({ type: String, enum: ['Like', 'Comment', 'Post', 'Mention', 'Airport'], required: true })
    notifiable_type: string;

    @Prop({ required: true })
    notifiable_id: number;

    @Prop({ required: true })
    pilot_id: number;

    @Prop({ required: true })
    notification_type_id: number;

    @Prop({ default: false })
    readed: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.virtual('pilot', {
    ref: 'Pilot',
    localField: 'pilot_id',
    foreignField: 'id',
})