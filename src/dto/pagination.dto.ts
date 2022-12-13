import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, Validate } from "class-validator";
import { ValidatePagePagination } from "src/modules/posts/pagination";

export class PaginationDTO {
    @IsNotEmpty()
    @Validate(ValidatePagePagination, [true], { message: 'page starts from 1' })
    @ApiProperty()
    page: string;

    @IsNotEmpty()
    @Validate(ValidatePagePagination, [false], { message: 'per_page cannot exceed 25' })
    @ApiProperty()
    per_page: string;
}

export class PaginationDTOWithSearch extends PaginationDTO {
    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    search?: string;
}