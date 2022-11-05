import { ApiProperty } from "@nestjs/swagger"

export class BaseCommunity {
    @ApiProperty()
    id: number

    @ApiProperty()
    name?: string
}