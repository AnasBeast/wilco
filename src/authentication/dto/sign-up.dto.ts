import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsOptional, MinLength, Validate } from 'class-validator';
import { Types } from 'mongoose';
import { IsUserAlreadyExist } from 'src/modules/pilots/UserExists';

export class SignUpDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'James' })
  readonly first_name: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Lebron' })
  readonly last_name: string;

  @IsEmail()
  @ApiProperty({ example: 'qwerty@gmail.com' })
  @Validate(IsUserAlreadyExist, [false])
  readonly email: string;

  @MinLength(8)
  @ApiProperty({ example: 'qwerty123'})
  readonly password: string;

  @IsNumber({}, { each: true })
  @ApiProperty({ example: 'pilot role(s) id(s) | exp ["635820733ce0994a2711582a"]' })
  readonly roles: number[];

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'role(s) seperated by commas' })
  readonly custom_roles: string;

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
