import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true, toObject: { transform: true }, toJSON: { transform: true } })
export class Post_Hashtags {
    @Prop({ required: true })
    hashtag_id: number;

    @Prop({ required: true })
    post_id: number;
}

export const PostHashtagsSchema = SchemaFactory.createForClass(Post_Hashtags);

PostHashtagsSchema.virtual("hashtag", {
    ref: 'Hashtags',
    localField: 'hashtag_id',
    foreignField: 'id',
    justOne: true,
})