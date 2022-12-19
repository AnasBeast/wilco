import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class CommentBodyDTO {
    @ApiProperty()
    @IsNotEmpty()
    text: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    parent_comment_id?: number;
}

export class CreateCommentDTO {
    @ApiProperty()
    @ValidateNested()
    @Type(() => CommentBodyDTO)
    comment: CommentBodyDTO;
}
