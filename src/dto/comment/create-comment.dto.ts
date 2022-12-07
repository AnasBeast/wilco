import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CreateCommentDTO {
    @ApiProperty()
    text: string;

    @ApiProperty()
    parentCommentId?: Types.ObjectId;
    
    @ApiProperty()
    hashtags?: Types.ObjectId[];

    @ApiProperty()
    mentioned_users?: Types.ObjectId[];
}
