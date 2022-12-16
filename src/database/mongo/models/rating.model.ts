import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RatingDocument = HydratedDocument<Rating>;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Rating {
    @Prop()
    id: number;

    @Prop()
    name: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);