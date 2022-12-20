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
import { AircraftObjectDTO, CreateAirCraftDto } from '../airCrafts/dto/create.dto';
import { AirCraftService } from '../airCrafts/airCrafts.service';
import { CreatePilotDto } from 'src/dto/pilot/create-pilot.dto';
import { FlightService } from '../flights/flights.service';
import { PilotPatchDto } from 'src/dto/user/update-user.dto';

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
  async createPilot({ pilot }: CreatePilotDto, userId: number) {
    const roleExist = await this.rolesService.getRolesByFilter({ id: { $in: pilot.roles } }, { select: 'id' });
    if (!roleExist || pilot.roles.length !== roleExist.length) throw new BadRequestException(errors.ROLE_NOT_EXIST);

    let createdRoles;
    let newPilot;
    if (pilot.custom_roles) {
      createdRoles = await this.rolesService.createCustomRoles(pilot.custom_roles);
      newPilot = await this.pilotsRepository.createPilot({
        ...{ first_name: pilot.first_name, last_name: pilot.last_name },
        roles_ids: [...pilot.roles, ...createdRoles.map((role: any) => role.id)],
      });
    }else {
      newPilot = await this.pilotsRepository.createPilot({
        ...{ first_name: pilot.first_name, last_name: pilot.last_name },
        roles_ids: [...pilot.roles],
      });
    }
    
    await this.usersRepository.addPilotIdToUser(userId, newPilot.id);
    return newPilot;
  }

  // GET PILOT BY ID OR EMAIL
  async getPilotById(id: string, pilotId: number, email: string) {
    if (id === 'me') {
      const pilot = await this.pilotsRepository.getMeById(pilotId);
      const latest_flights = await this.flightsService.getLatestFlights(pilot.aircrafts?.map((aircraft) => aircraft.id));
      return { ...pilot, latest_flights, user: { email: email } };
    }
    const parsedId = parseInt(id, 10);
    if(isNaN(parsedId)) {
      throw new BadRequestException()
    }
    const pilot = await this.pilotsRepository.getPilotById(parsedId);
    const latest_flights = await this.flightsService.getLatestFlights(pilot.aircrafts?.map((aircraft) => aircraft.id));
    return { ...pilot, latest_flights };
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

  async editPilotById(id: string, editedUser: PilotPatchDto, pilotId: number) {
    if (id !== 'me' && Number.parseInt(id) !== pilotId) {
      throw new UnauthorizedException();
    }
    const pilot = await this.pilotsRepository.getMeById(pilotId);
    if (editedUser.profile_picture_base64) {
      if (pilot.profile_picture_key) {
        await this.s3Service.deleteFile(pilot.profile_picture_key);
      }
      const resUpload = await this.s3Service.uploadFile(editedUser.profile_picture_base64);
      if (!resUpload) throw new BadRequestException(errors.FILE_UPLOAD_ERROR);
      const updatedPilot = await this.pilotsRepository.editPilot(pilotId, {
        ...editedUser,
        profile_picture_key: resUpload.key,
        profile_picture_url: resUpload.location,
      });
      const latest_flights = await this.flightsService.getLatestFlights(pilot.aircrafts?.map((aircraft) => aircraft.id));
      return {...updatedPilot, latest_flights};
    }
    const updatedPilot = await this.pilotsRepository.editPilot(pilotId, editedUser);
    const latest_flights = await this.flightsService.getLatestFlights(pilot.aircrafts?.map((aircraft) => aircraft.id));
    return {...updatedPilot, latest_flights};
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
    const pilot = await this.pilotsRepository.getPilotById(id);
    if (!pilot) {
      throw new NotFoundException(errors.PILOT_NOT_FOUND);
    }
    const FoundAirports = await this.airportService.getAirportsByFilter({ icao: { $in: airports } }, ['icao']);
    FoundAirports.map((airport) => {
      if (!pilot.airports.includes(airport.icao)) {
        pilot.airports.push(airport.icao);
      }
    })
    const updatedPilot = await this.pilotsRepository.editPilot(pilotId, { airports: pilot.airports });
    const latest_flights = await this.flightsService.getLatestFlights(pilot.aircrafts?.map((aircraft) => aircraft.id));
    return { ...updatedPilot, latest_flights };
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
    if(!airport) {
      throw new NotFoundException();
    }
    return await this.pilotsRepository.getPilotsByFilter({ home_airport: airport.icao });
  }

  async searchByCommunities(name: string) {
    const community = await this.communityService.findCommunityByFilter({ name });
    if (!community) {
      throw new NotFoundException()
    }
    return await this.pilotsRepository.getPilotsByFilter({ communities_tags: { $in: [community.name] } });
  }

  // aircrafts

  // create aircraft
  async createAircraft(body: AircraftObjectDTO, pilotId: number) {
    const aircraftExist = await this.aircraftsService.getAircraftByFilter({ tail_number: body.tail_number });
    if(aircraftExist) {
      throw new BadRequestException();
    }
    const aircraft = await this.aircraftsService.create(body, pilotId);
    if (!aircraft) throw new BadRequestException();
    return aircraft;
  }
}
