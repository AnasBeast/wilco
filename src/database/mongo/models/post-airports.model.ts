import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

export type Post_Airports_Document = HydratedDocument<Post_Airports>;

@Schema({ timestamps: true })
export class Post_Airports {
    @ApiProperty()
    @Prop({ required: true })
    airport_id: number;

    @ApiProperty()
    @Prop({ required: true })
    pilot_id: number;

    @ApiProperty()
    @Prop({ required: true })
    home_airport: boolean;
}

export const Post_Airports_Schema = SchemaFactory.createForClass(Post_Airports);

