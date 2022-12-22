import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Pilot_Ratings {
    @Prop({ required: true })
    pilot_id: number;

    @Prop({ required: true })
    rating_id: number;
}

export const PilotRatingsSchema = SchemaFactory.createForClass(Pilot_Ratings);

PilotRatingsSchema.virtual("rating", {
    ref: 'Rating',
    localField: 'rating_id',
    foreignField: 'id',
    justOne: true,
})