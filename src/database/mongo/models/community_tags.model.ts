import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CommunityTagsDocument = HydratedDocument<Community_tags>;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Community_tags {
    @Prop({ required: true })
    community_id: number;

    @Prop({ required: true })
    taggable_type: string;

    @Prop({ required: true })
    taggable_id: number;
}

export const CommunityTagsSchema = SchemaFactory.createForClass(Community_tags);

CommunityTagsSchema.virtual("community", {
    ref: 'Community',
    localField: 'community_id',
    foreignField: 'id',
    justOne: true,
})