import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ObjectId, Types } from 'mongoose';
import { RoleEntity } from 'src/common/entities/role.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { User, UserDocument } from 'src/database/mongo/models/user.model';
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

  async create(body: SignUpDto): Promise<User> {
    const roleExist = await this.rolesService.getRolesByFilter({ _id: {$in: body.roles} }, { select: "_id" });
    if (!roleExist || body.roles.length !== roleExist.length) throw new HttpException(errors.ROLE_NOT_EXIST, HttpStatus.BAD_REQUEST)

    let createdRoles: RoleEntity[] = [];
    if (body.custom_roles) {
      let newRoles: RoleEntity[] = [];
      let rolesFilterArray: string[] = [] 

      body.custom_roles.split(",").map((role) => {
        rolesFilterArray.push(role)
        newRoles.push({ name: role, custom: true })
      })

      createdRoles = await this.rolesService.createCustomRoles(newRoles, rolesFilterArray);
    }

    return await this.usersRepository.createNewUser({...body, roles: [...body.roles, ...createdRoles.map((role) => role._id)]});
  }
}