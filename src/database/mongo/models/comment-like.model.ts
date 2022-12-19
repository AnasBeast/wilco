import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema({ timestamps: true })
export class CommentLike {
    @Prop({ required: true })
    pilot_id: number;

    @Prop({ required: true })
    comment_id: number;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);