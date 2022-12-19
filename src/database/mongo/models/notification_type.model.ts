import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class NotificationType {
    @Prop()
    type: string;
}

export const NotificationTypeSchema = SchemaFactory.createForClass(NotificationType);