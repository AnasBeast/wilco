import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ObjectId, Types, UpdateQuery } from 'mongoose';
import { TokenResponseDto } from 'src/authentication/dto/token.response.dto';
import { RoleEntity } from 'src/common/entities/role.entity';
import { UserEntity } from 'src/common/entities/user.entity';
import { User, UserDocument } from 'src/database/mongo/models/user.model';
import { AddAirportsToPilotDTO } from 'src/dto/pilot/add-airports-to-pilot.dto';
import { GetPilotsDTO } from 'src/dto/pilot/get-pilots.dto';
import { EditUserDto } from 'src/dto/user/update-user.dto';
import fb_admin from 'src/main';
import admin from 'src/main';
import { AirportsService } from '../airports/airports.service';
import { CommunityService } from '../communities/community.service';
import { SignUpDto } from '../../authentication/dto/sign-up.dto';
import { errors } from '../../common/helpers/responses/error.helper';
import { S3Service } from '../files/s3.service';
import { RolesService } from '../roles/roles.service';
import { PilotsRepository } from './pilots.repository';
import { Pilot } from 'src/schemas/pilot.schema';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class PilotsService {
  constructor(private pilotsRepository: PilotsRepository, private rolesService: RolesService, private s3Service: S3Service, private airportService: AirportsService, private communityService: CommunityService, private usersRepository: UsersRepository) { }

  // GET ALL WITH PAGINATION
  async getPilots(page: number, per_page: number) {
    return await this.pilotsRepository.getPilots(page, per_page);
  }
  
  // GET PILOT BY ID OR EMAIL
  async getPilotById(id: string, pilotId: number, userId: string) {
    if (id === "me") {
      console.log(pilotId, userId)
      const pilot = await this.pilotsRepository.getMeById(pilotId);
      const user = await this.usersRepository.getMeById(userId);
      return { pilot, user: {email: user.email} }
    }
    return await this.pilotsRepository.getPilotById(id);
  }

  // async getPopulatedUserByEmail(email: string): Promise<UserDocument> {
  //   return await this.pilotsRepository.getMeByEmail(email);
  // }

  // async getUserById(id: string): Promise<User> {
  //   return await this.pilotsRepository.getUserById(id);
  // }

  // async getUserByEmail(email: string): Promise<UserEntity> {
  //   return await this.pilotsRepository.getUserByFilter({ email }, []);
  // }

  // async getUserDocumentByEmail(email: string): Promise<UserDocument> {
  //   return await this.pilotsRepository.getUserDocumentByFilter({ email });
  // }

  async editPilotById(id: string, editedUser: UpdateQuery<User>, pilotId: number, file?: Express.Multer.File) {
    if (id !== "me") {
      throw new UnauthorizedException();
    }
    const pilot = await this.pilotsRepository.getMeById(pilotId);
    if(file) {
      if (pilot.profile_picture_key) {
        await this.s3Service.deleteFile(pilot.profile_picture_key);
      }
      const resUpload = await this.s3Service.uploadFile(file);
      if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);
      const updatedPilot = await this.pilotsRepository.editPilot(pilot._id.toHexString(), { ...editedUser, profile_picture_key: resUpload.key, profile_picture_url: resUpload.location })
      return { pilot: updatedPilot }
    }
    
    const updatedPilot = await this.pilotsRepository.editPilot(pilot._id.toHexString(), editedUser);
    return { pilot: updatedPilot }
  }

  //delete all data!
  async deletePilotById(id: string, pilotId: number) {
    if (id !== "me") {
      throw new UnauthorizedException();
    }
    const pilot = await this.pilotsRepository.getMeById(pilotId);
    if (pilot._id.toString() !== id) {
      throw new UnauthorizedException();
    }

    return await this.pilotsRepository.deletePilot(pilotId);
  }

  async addAirportsToPilot(id: string, airports: string[], pilotId: string) {
    const pilot = await this.pilotsRepository.getPilotDocumentById(id);
    if (!pilot) {
      throw new NotFoundException(errors.PILOT_NOT_FOUND);
    }
    if (pilot._id.toString() !== pilotId) {
      throw new ForbiddenException(errors.PERMISSION_DENIED);
    }
    const FoundAirports = await this.airportService.getAirportsByFilter({ icao: { $in : airports } }, ["_id"]);
    pilot.airports = FoundAirports.map(airport => airport._id);
    return await pilot.save();
  }


  
  async searchByName(pattern: string) {
    // const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    // if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.pilotsRepository.getPilotsByFilter({
      $or: [{ first_name: { $regex: pattern, $options: 'i' } }, { last_name: { $regex: pattern, $options: 'i' } }],
    }, ["first_name", "last_name", "banner", "home_airport", "primary_aircraft", "profile_picture_link"]);
  }

  // async searchByHomeAirPort(airport_code: string): Promise<User[]> {
  //   const airport = await this.airportService.getAirportByFilter({ icao: airport_code });
  //   console.log(airport, airport_code);
  //   return await this.pilotsRepository.getPilotsByFilter({
  //     home_airport: airport._id
  //   }, ["first_name", "last_name", "banner", "home_airport", "primary_aircraft", "profile_picture_link"]);
  // }

  async searchByCommunities(name: string) {
    const community = await this.communityService.findCommunityByFilter({ name });
    return await this.pilotsRepository.getPilotsByFilter({ communities: { $in: [community._id] } }, ["first_name", "last_name", "banner", "home_airport", "primary_aircraft", "profile_picture_link"])
  }

}