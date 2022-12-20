import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, MinLength, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsUserAlreadyExist } from 'src/modules/users/UserExists';

export class SignUpDto {
  @ApiProperty({ example: 'qwerty@gmail.com' })
  @IsEmail()
  @Validate(IsUserAlreadyExist, [false])
  readonly email: string;

  @ApiProperty({ example: 'qwerty123'})
  @MinLength(8)
  readonly password: string;
}

export class SignUpSuperAdminDto extends SignUpDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Secret key' })
  secret: string;
}

export class SignUpDtoWithProfilePhotoDto extends SignUpDto {
  @IsNotEmpty()
  profile_picture_link: string;

  @IsNotEmpty()
  profile_picture_key: string;
}
