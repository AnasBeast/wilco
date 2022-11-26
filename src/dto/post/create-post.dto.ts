import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

enum Visiblity {
  public,
  only_me,
}

export class BasePost {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  visibility: Visiblity;

  @ApiProperty()
  flight: Types.ObjectId;

  @ApiProperty()
  post_communities: string[];

  @ApiProperty()
  mentioned_users: Types.ObjectId[]

  @ApiProperty()
  contribution: Types.ObjectId;
}
