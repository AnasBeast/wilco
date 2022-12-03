import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ObjectId, Types, UpdateQuery } from 'mongoose';
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

  async getUsers() {
    return await this.usersRepository.getUsers(["first_name", "last_name", "banner", "home_airport", "profile_picture_link"]);
  }
  
  async getPopulatedUserById(id: string, userId: string) {
    if (id === "me" || id === userId) {
      return await this.usersRepository.getMe(userId);
    }
    return await this.usersRepository.getPopulatedUserById(id);
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.usersRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.getUserByFilter({ email });
  }

  async getUserDocumentByEmail(email: string): Promise<UserDocument> {
    return await this.usersRepository.getUserDocumentByFilter({ email });
  }



  async create({ email, password, custom_roles, first_name, last_name, roles }: SignUpDto): Promise<UserEntity> {
    const roleExist = await this.rolesService.getRolesByFilter({ _id: {$in: roles} }, { select: "_id" });
    if (!roleExist || roles.length !== roleExist.length) throw new HttpException(errors.ROLE_NOT_EXIST, HttpStatus.BAD_REQUEST)



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

    const newUser = await this.usersRepository.createNewUser({...{email, first_name, last_name, firebase_uid}, roles: [...roles, ...createdRoles.map((role) => role._id)]});

    await fb_admin.auth().setCustomUserClaims(firebase_uid, { _id: newUser._id });

    return newUser;
  }

  async editUserById(id: string, editedUser: UpdateQuery<User>, userId: string, file?: Express.Multer.File) {
    if (id !== "me" && id !== userId) {
      throw new UnauthorizedException();
    }
    if(file) {
      const user = await this.usersRepository.getUserById(userId);
      if (user.profile_picture_key) {
        await this.s3Service.deleteFile(user.profile_picture_key);
      }
      const resUpload = await this.s3Service.uploadFile(file);
      if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);
      return await this.usersRepository.editUser(userId, { ...editedUser, profile_picture_key: resUpload.key, profile_picture_link: resUpload.location })
    }

    return await this.usersRepository.editUser(userId, editedUser);
  }

  //delete all data!
  async deleteUserById(id: string, userId: string) {
    if (id !== "me" && id !== userId) {
      throw new UnauthorizedException();
    }

    return await this.usersRepository.deleteUser(userId);
  }

  async searchByName(pattern: string) {
    // const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    // if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.usersRepository.getUsersByFilter({
      $or: [{ first_name: { $regex: pattern, $options: 'i' } }, { last_name: { $regex: pattern, $options: 'i' } }],
    });
  }

  async searchByHomeAirPort(airportId: string): Promise<User[]> {
    return await this.usersRepository.getUsersByFilter({
      home_airport: new Types.ObjectId(airportId),
    });
  }

  async searchByCommunities() {

  }
}