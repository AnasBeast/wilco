import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { CreatePilotDto } from 'src/dto/pilot/create-pilot.dto';
import { PilotPatchDto } from 'src/dto/user/update-user.dto';
import { errors } from '../../common/helpers/responses/error.helper';
import { AirCraftService } from '../airCrafts/airCrafts.service';
import { AircraftObjectDTO, CreateAirCraftDto, UpdateAircraftObjectDTO } from '../airCrafts/dto/create.dto';
import { AirportsService } from '../airports/airports.service';
import { CommunityService } from '../communities/community.service';
import { S3Service } from '../files/s3.service';
import { FlightService } from '../flights/flights.service';
import { RolesService } from '../roles/roles.service';
import { UsersRepository } from '../users/users.repository';
import { PilotsRepository } from './pilots.repository';
import { PostsService } from '../posts/posts.service';

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
    private flightsService: FlightService,
    private postsService: PostsService
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
    if(isNaN(+id)) {
      throw new BadRequestException()
    }
    const pilot = await this.pilotsRepository.getPilotById(+id);
    const latest_flights = await this.flightsService.getLatestFlights(pilot.aircrafts?.map((aircraft) => aircraft.id));
    return { ...pilot, latest_flights };
  }

  async getPilotPostsById(id: string, pilotId: number, page: number, per_page: number) {
    if(id !== 'me' && isNaN(+id)) throw new BadRequestException();
    if(id === "me" || +id === pilotId ) {
      return await this.postsService.getFeedPosts(page, per_page, pilotId, 'false');
    }
    return await this.postsService.getFeedPosts(page, per_page, +id, 'false');
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
    if (id !== 'me' && isNaN(+id)) throw new UnauthorizedException();

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

  async addAirportsToPilot(id: string, airports: string[], pilotId: number) {
    if(isNaN(+id)) throw new BadRequestException("pilot_id should be a number");
    const pilot = await this.pilotsRepository.getPilotById(+id);
    if (!pilot) throw new NotFoundException(errors.PILOT_NOT_FOUND);
    if (pilot.id !== pilotId) throw new ForbiddenException(errors.PERMISSION_DENIED);
    
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

  async searchByName(pattern: string, page: number, per_page: number) {
    const data = await this.pilotsRepository.getPilotsByFilter({
      $or: [{ first_name: { $regex: new RegExp(pattern), $options: 'i' } }, { last_name: { $regex: new RegExp(pattern), $options: 'i' } }],
    }, page, per_page);
    const count = await this.pilotsRepository.getPilotsCountByFilter({
      $or: [{ first_name: { $regex: new RegExp(pattern), $options: 'i' } }, { last_name: { $regex: new RegExp(pattern), $options: 'i' } }],
    });
    const pages = Math.ceil(count / per_page)
    return { 
      data,
      pagination: { 
        current: page,
        pages,
        first_page: (page - 1) * per_page === 0,
        last_page: page === pages || pages === 0,
       } 
    }
  }

  async searchByHomeAirPort(airport_code: string, page: number, per_page: number) {
    const airports = await this.airportService.getTransformedAirportsByFilter({ icao: { $regex: new RegExp(airport_code), $options: 'i' } });
    const data = await this.pilotsRepository.getPilotsByFilter({ home_airport: { $in: airports } }, page, per_page);
    const count = await this.pilotsRepository.getPilotsCountByFilter({ home_airport: { $in: airports } });
    const pages = Math.ceil(count / per_page);
    return {
      data,
      pagination: {
        current: page,
        pages,
        first_page: (page - 1) * per_page === 0,
        last_page: page === pages || pages === 0
      }
    }
  }

  async searchByCommunities(name: string, page: number, per_page: number) {
    const communities = await this.communityService.findTransformedCommunitiesByFilter({ name: { $regex: new RegExp(name), $options: 'i' } });
    const data = await this.pilotsRepository.getPilotsByCommnityTags(communities, page, per_page);
    const count = await this.pilotsRepository.getPilotsCountByCommnityTags(communities);
    const pages = Math.ceil(count / per_page);
    return {
      data,
      pagination: {
        current: page,
        pages,
        first_page: (page - 1) * per_page === 0,
        last_page: page === pages || pages === 0
      }
    }
  }

  // aircrafts
  // create aircraft
  async createAircraft(body: AircraftObjectDTO, pilotId: number) {
    const aircraft = await this.aircraftsService.create(body, pilotId);
    if (!aircraft) throw new BadRequestException();
    return aircraft;
  }
}
