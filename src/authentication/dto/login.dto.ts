import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, MinLength, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsUserAlreadyExist } from 'src/modules/users/UserExists';

export class LoginDto {

  @IsNotEmpty()
  @ApiProperty({ example: 'ID TOKEN' })
  readonly assertion: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'assertion' })
  readonly grant_type: string;

}