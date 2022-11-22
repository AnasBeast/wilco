import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'pilot' })
  readonly name: string;

  @IsOptional()
  @ApiProperty({ example: 'true|false' })
  readonly custom?: boolean
}
