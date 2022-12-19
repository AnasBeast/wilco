import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CommentDislikeDocument = HydratedDocument<CommentDislike>;

@Schema({ timestamps: true })
export class CommentDislike {
    @Prop({ required: true })
    pilot_id: number;

    @Prop({ required: true })
    comment_id: number;
}

export const CommentDislikeSchema = SchemaFactory.createForClass(CommentDislike);