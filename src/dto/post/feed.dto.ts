import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";

export class FeedDTO {
    @IsPositive()
    @ApiProperty()
    page: number;

    @IsPositive()
    @ApiProperty()
    per_page: number;

    @ApiProperty()
    feed?: boolean;

    @ApiProperty()
    community_tags?: string[]

    @ApiProperty()
    hashtags?: string[]
}