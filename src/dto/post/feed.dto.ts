import { ApiProperty } from "@nestjs/swagger";
import { IsBooleanString, IsOptional, IsPositive, IsString } from "class-validator";

export class FeedDTO {
    @ApiProperty()
    @IsOptional()
    @IsBooleanString()
    feed?: string;

    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    community_tags?: string[]

    @ApiProperty()
    @IsOptional()
    @IsString({ each: true })
    hashtags?: string[]
}