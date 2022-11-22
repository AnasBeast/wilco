import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({ example: 'qwerty@gmail.com' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'qwerty123' })
  readonly password: string;
}
