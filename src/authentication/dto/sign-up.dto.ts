import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsEmail, MinLength, Validate, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';
import { IsUserAlreadyExist } from 'src/modules/users/UserExists';

export class SignUpDto {
  @IsDefined()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  @ApiProperty({ example: 'qwerty@gmail.com' })
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ example: 'qwerty123' })
  readonly password: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'pilot role id' })
  readonly role: ObjectId;

  @IsOptional()
  readonly home_airport?: ObjectId;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'James' })
  readonly first_name: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lebron' })
  readonly last_name: string;
}

export class SignUpSuperAdminDto extends SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 'Secret key' })
  secret: string;
}

export class SignUpDtoProfilePhotoDto extends SignUpDto {
  @IsDefined()
  @IsNotEmpty()
  profile_picture_link: string;

  @IsDefined()
  @IsNotEmpty()
  profile_picture_key: string;
}
