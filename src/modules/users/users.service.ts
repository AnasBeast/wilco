import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
import { RoleEntity } from 'src/common/entities/role.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { User, UserDocument } from 'src/database/mongo/models/user.model';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import fb_admin from 'src/main';
import admin from 'src/main';
import { SignUpDto } from './../../authentication/dto/sign-up.dto';
import { errors } from './../../common/helpers/responses/error.helper';
import { S3Service } from './../files/s3.service';
import { RolesService } from './../roles/roles.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private rolesService: RolesService, private s3Service: S3Service) { }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.getUserByFilter({ email });
  }

  async getUserDocumentByEmail(email: string): Promise<UserDocument> {
    return await this.usersRepository.getUserDocumentByFilter({ email });
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.usersRepository.getUserByFilter({ _id: new Types.ObjectId(id) });
  }

  async create({ email, password, custom_roles, first_name, last_name, roles }: SignUpDto): Promise<User> {
    const roleExist = await this.rolesService.getRolesByFilter({ _id: {$in: roles} }, { select: "_id" });
    if (!roleExist || roles.length !== roleExist.length) throw new HttpException(errors.ROLE_NOT_EXIST, HttpStatus.BAD_REQUEST)

    let firebase_uid: string;
    try {
      const user = await fb_admin.auth().createUser({
        email,
        password
      });
      firebase_uid = user.uid;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    let createdRoles: RoleEntity[] = [];
    if (custom_roles) {
      let newRoles: RoleEntity[] = [];
      let rolesFilterArray: string[] = [] 

      custom_roles.split(",").map((role) => {
        rolesFilterArray.push(role)
        newRoles.push({ name: role, custom: true })
      })

      createdRoles = await this.rolesService.createCustomRoles(newRoles, rolesFilterArray);
    }

    return await this.usersRepository.createNewUser({...{email, first_name, last_name, firebase_uid}, roles: [...roles, ...createdRoles.map((role) => role._id)]});
  }

  // async updateUser(updatedUser: EditUserDto, file: Express.Multer.File) {
  //   return await this.usersRepository.updateUser(updatedUser._id,updatedUser);
  // }
}