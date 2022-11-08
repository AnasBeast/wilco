import { Types } from 'mongoose';
import { S3Service } from './../files/s3.service';
import { RolesService } from './../roles/roles.service';
import { SignUpDto } from './../../authentication/dto/sign-up.dto';
import { AuthenticationProvider } from './../../authentication/auth.provider';
import { errors } from './../../common/helpers/responses/error.helper';
import { UsersRepository } from './users.repository';
import { UserEntity } from '../../common/entities/user.entity';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private rolesService: RolesService, private s3Service: S3Service) {}

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.getUserByFilter({ email });
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.usersRepository.getUserByFilter({ _id: new Types.ObjectId(id) });
  }

  async create(body: SignUpDto, file: Express.Multer.File) {
    const userExist = await this.usersRepository.getUserByFilter({ email: body.email });
    if (userExist) throw new HttpException(errors.USER_EXIST, HttpStatus.BAD_REQUEST);

    const roleExist = await this.rolesService.getRoleByFilter({ _id: body.role });
    if (!roleExist) throw new HttpException(errors.ROLE_NOT_EXIST, HttpStatus.BAD_REQUEST);

    const resUpload = await this.s3Service.uploadFile(file);
    if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);

    const userData = await this.createUserData(body);

    return await this.usersRepository.createNewUser({
      ...userData,
      profile_picture_link: resUpload.location,
      profile_picture_key: resUpload.key,
    });
  }

  async createUserData(signUpDto: SignUpDto): Promise<SignUpDto> {
    const hashedPassword = await AuthenticationProvider.generateHash(signUpDto.password);

    return {
      ...signUpDto,
      password: hashedPassword,
    };
  }
}
