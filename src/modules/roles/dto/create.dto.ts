import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'pilot' })
  readonly name: string;
}
