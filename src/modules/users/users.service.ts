import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ObjectId, Types, UpdateQuery } from 'mongoose';
import { TokenResponseDto } from 'src/authentication/dto/token.response.dto';
import { RoleEntity } from 'src/common/entities/role.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { User, UserDocument } from 'src/database/mongo/models/user.model';
import { AddAirportsToPilotDTO } from 'src/dto/pilot/add-airports-to-pilot.dto';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import fb_admin from 'src/main';
import admin from 'src/main';
import { AirportsService } from '../airports/airports.service';
import { CommunityService } from '../communities/community.service';
import { SignUpDto } from './../../authentication/dto/sign-up.dto';
import { errors } from './../../common/helpers/responses/error.helper';
import { S3Service } from './../files/s3.service';
import { RolesService } from './../roles/roles.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private rolesService: RolesService, private s3Service: S3Service, private airportService: AirportsService, private communityService: CommunityService) { }

  async getUsers() {
    return await this.usersRepository.getUsers(["first_name", "last_name", "banner", "home_airport", "profile_picture_link"]);
  }
  
  async getPopulatedUserById(id: string, userId: string) {
    if (id === "me" || id === userId) {
      return await this.usersRepository.getMeByEmail(userId);
    }
    return await this.usersRepository.getPopulatedUserByEmail(id);
  }

  async getPopulatedUserByEmail(email: string): Promise<UserDocument> {
    return await this.usersRepository.getMeByEmail(email);
  }

  async getUserById(id: string): Promise<User> {
    return await this.usersRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.getUserByFilter({ email }, []);
  }

  async getUserDocumentByEmail(email: string): Promise<UserDocument> {
    return await this.usersRepository.getUserDocumentByFilter({ email });
  }

  async login(token: string): Promise<TokenResponseDto> {
    let firebase_uid: string;
    try {
      const decodedToken = await fb_admin.auth().verifyIdToken(token);
      firebase_uid = decodedToken.uid;
      return { 
        access_token: token, 
        token_type: 'Bearer',
        created_at: decodedToken.iat, 
        expires_in: decodedToken.exp
      };

    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
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

  async editUserByEmail(id: string, editedUser: UpdateQuery<User>, email: string, file?: Express.Multer.File) {
    if (id !== "me" && id !== email) {
      throw new UnauthorizedException();
    }
    if(file) {
      const user = await this.usersRepository.getUserByEmail(email);
      if (user.profile_picture_key) {
        await this.s3Service.deleteFile(user.profile_picture_key);
      }
      const resUpload = await this.s3Service.uploadFile(file);
      if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);
      return await this.usersRepository.editUserByEmail(email, { ...editedUser, profile_picture_key: resUpload.key, profile_picture_link: resUpload.location })
    }

    return await this.usersRepository.editUserByEmail(email, editedUser);
  }
  //delete all data!
  async deleteUserById(id: string, userId: string) {
    if (id !== "me" && id !== userId) {
      throw new UnauthorizedException();
    }

    return await this.usersRepository.deleteUserByEmail(userId);
  }

  async addAirportsToPilot(id: string, airports: string[], userEmail: string) {
    const pilot = await this.usersRepository.getUserDocumentByFilter({ _id: id });
    if (!pilot) {
      throw new NotFoundException(errors.PILOT_NOT_FOUND);
    }
    if (pilot.email !== userEmail) {
      throw new ForbiddenException(errors.PERMISSION_DENIED);
    }
    const FoundAirports = await this.airportService.getAirportsByFilter({ icao: { $in : airports } }, ["_id"]);
    pilot.preferred_airports = FoundAirports.map(airport => airport._id);
    return await pilot.save();
  }


  
  async searchByName(pattern: string) {
    // const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    // if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.usersRepository.getUsersByFilter({
      $or: [{ first_name: { $regex: pattern, $options: 'i' } }, { last_name: { $regex: pattern, $options: 'i' } }],
    }, ["first_name", "last_name", "banner", "home_airport", "primary_aircraft", "profile_picture_link"]);
  }

  async searchByHomeAirPort(airport_code: string): Promise<User[]> {
    const airport = await this.airportService.getAirportByFilter({ icao: airport_code });
    console.log(airport, airport_code);
    return await this.usersRepository.getUsersByFilter({
      home_airport: airport._id
    }, ["first_name", "last_name", "banner", "home_airport", "primary_aircraft", "profile_picture_link"]);
  }

  async searchByCommunities(name: string) {
    const community = await this.communityService.findCommunityByFilter({ name });
    return await this.usersRepository.getUsersByFilter({ communities: { $in: [community._id] } }, ["first_name", "last_name", "banner", "home_airport", "primary_aircraft", "profile_picture_link"])
  }

}