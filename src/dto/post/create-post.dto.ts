import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

type Visibility = "public" | "only_me";

export class CreatePostDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  visibility: Visibility;

  @ApiProperty()
  flight?: Types.ObjectId;

  @ApiProperty()
  post_communities?: Types.ObjectId[];

  @ApiProperty()
  mentioned_users?: Types.ObjectId[]

  @ApiProperty()
  contribution?: Types.ObjectId;
}
