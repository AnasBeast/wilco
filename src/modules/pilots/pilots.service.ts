import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { CreateAirCraftDto } from '../airCrafts/dto/create.dto';
import { AirCraftService } from '../airCrafts/airCrafts.service';
import { CreatePilotDto } from 'src/dto/pilot/create-pilot.dto';
import { FlightService } from '../flights/flights.service';

@Injectable()
export class PilotsService {
  constructor(
    private pilotsRepository: PilotsRepository,
    private rolesService: RolesService,
    private s3Service: S3Service,
    private airportService: AirportsService,
    private communityService: CommunityService,
    private usersRepository: UsersRepository,
    private aircraftsService: AirCraftService,
    private flightsService: FlightService
  ) {}

  // GET ALL WITH PAGINATION
  async getPilots(page: number, per_page: number) {
    const pilots = await this.pilotsRepository.getPilots(page, per_page);
    const count = await this.pilotsRepository.countPilots();
    return {
      data: pilots,
      pagination: {
        current: page,
        pages: Math.ceil(count / per_page),
        first_page: (page - 1) * per_page === 0,
        last_page: count < (page - 1) * per_page + per_page,
      },
    };
  }

  // CREATE PILOT
  async createPilot({ pilot }: CreatePilotDto) {
    const roleExist = await this.rolesService.getRolesByFilter({ id: { $in: pilot.roles } }, { select: 'id' });
    if (!roleExist || pilot.roles.length !== roleExist.length) throw new BadRequestException(errors.ROLE_NOT_EXIST);

    const createdRoles = await this.rolesService.createCustomRoles(pilot.custom_roles);
    return await this.pilotsRepository.createPilot({
      ...{ first_name: pilot.first_name, last_name: pilot.last_name },
      roles_ids: [...pilot.roles, ...createdRoles.map((role: any) => role.id)],
    });
  }

  // GET PILOT BY ID OR EMAIL
  async getPilotById(id: string, pilotId: number, email: string) {
    if (id === 'me') {
      const pilot = await this.pilotsRepository.getMeById(pilotId);
      //@ts-ignore
      const latest_flights = await this.flightsService.getLatestFlights(pilot.aircrafts.map((aircraft) => aircraft.id));
      return { ...pilot, latest_flights, user: { email: email } };
    }
    return await this.pilotsRepository.getPilotById(Number.parseInt(id));
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
    if (id !== 'me' && Number.parseInt(id) !== pilotId) {
      throw new UnauthorizedException();
    }
    const pilot = await this.pilotsRepository.getMeById(pilotId);
    if (file) {
      if (pilot.profile_picture_key) {
        await this.s3Service.deleteFile(pilot.profile_picture_key);
      }
      const resUpload = await this.s3Service.uploadFile(file);
      if (!resUpload) throw new BadRequestException(errors.FILE_UPLOAD_ERROR);
      const updatedPilot = await this.pilotsRepository.editPilot(pilotId, {
        ...editedUser,
        profile_picture_key: resUpload.key,
        profile_picture_url: resUpload.location,
      });
      return { pilot: updatedPilot };
    }

    const updatedPilot = await this.pilotsRepository.editPilot(pilotId, editedUser);
    return { pilot: updatedPilot };
  }

  //delete all data!
  async deletePilotById(id: string, pilotId: number) {
    if (id !== 'me' && Number.parseInt(id) !== pilotId) {
      throw new UnauthorizedException();
    }

    return await this.pilotsRepository.deletePilot(pilotId);
  }

  async addAirportsToPilot(id: number, airports: string[], pilotId: number) {
    if (id != pilotId) {
      throw new ForbiddenException(errors.PERMISSION_DENIED);
    }
    const pilot = await this.pilotsRepository.getPilotDocumentById(id);
    if (!pilot) {
      throw new NotFoundException(errors.PILOT_NOT_FOUND);
    }
    const FoundAirports = await this.airportService.getAirportsByFilter({ icao: { $in: airports } }, ['icao']);
    pilot.airports = FoundAirports.map((airport) => airport.icao);
    return await pilot.save();
  }

  async searchByName(pattern: string) {
    // const pilotRoleExist = await this.rolesService.getRoleByFilter({ name: 'pilot' });
    // if (!pilotRoleExist) throw new HttpException(errors.ROLE_EXIST, HttpStatus.BAD_REQUEST);

    return await this.pilotsRepository.getPilotsByFilter({
      $or: [{ first_name: { $regex: pattern, $options: 'i' } }, { last_name: { $regex: pattern, $options: 'i' } }],
    });
  }

  async searchByHomeAirPort(airport_code: string) {
    const airport = await this.airportService.getAirportByFilter({ icao: airport_code });
    return await this.pilotsRepository.getPilotsByFilter({ home_airport: airport.icao });
  }

  async searchByCommunities(name: string) {
    const community = await this.communityService.findCommunityByFilter({ name });
    return await this.pilotsRepository.getPilotsByFilter({ communities: { $in: [community._id] } });
  }

  // aircrafts

  // create aircraft
  async createAircraft(body: CreateAirCraftDto, pilotId: number, file?: Express.Multer.File) {
    const aircraft = await this.aircraftsService.create(body, pilotId, file);
    if (!aircraft) throw new BadRequestException();
    return await this.pilotsRepository.getMeById(pilotId);
  }
}
