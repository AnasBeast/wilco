import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";

export class FeedDTO {
    @ApiProperty()
    feed?: boolean;

    @ApiProperty()
    community_tags?: string[]

    @ApiProperty()
    hashtags?: string[]
}