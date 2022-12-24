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
import { NotificationsService } from '../notifications/notifications.service';
import { PilotRolesDocument, Pilot_Roles } from 'src/database/mongo/models/pilot-roles.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from 'src/database/mongo/models/like.model';
import { Comment, CommentDocument } from 'src/database/mongo/models/comment.model';
import { Post, PostDocument } from 'src/database/mongo/models/post.model';
import { Mention, MentionDocument } from 'src/database/mongo/models/mention.model';
import { Report, ReportDocument } from 'src/database/mongo/models/reports.model';

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
    private postsService: PostsService,
    private notificationsService: NotificationsService,
    @InjectModel(Pilot_Roles.name) private pilotRolesModel: Model<PilotRolesDocument>,
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Mention.name) private mentionModel: Model<MentionDocument>,
    @InjectModel(Report.name)
    private readonly reportModel: Model<ReportDocument>,
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
        first_name: pilot.first_name, last_name: pilot.last_name
      });
    }else {
      newPilot = await this.pilotsRepository.createPilot({
        first_name: pilot.first_name, last_name: pilot.last_name
      });
    }

    pilot.roles.map(async role_id => await this.pilotRolesModel.create({ pilot_id: newPilot.id, role_id }));
    createdRoles.map((role: any) => role.id).map(async role_id => await this.pilotRolesModel.create({ pilot_id: newPilot.id, role_id }));
    
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
    const pilot = this.pilotsRepository.getPilotDocumentById(+id);
    if(!pilot) throw new NotFoundException();
    return await this.postsService.getPublicPostsByPilotId(page, per_page, +id, pilotId);
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

  // notifications
  async getNotificationsUnreadNumber(pilot_id: number) {
    return await this.notificationsService.getUnreadNumber(pilot_id);
  }

  async getNotifications(pilot_id: number, page: number, per_page: number) {
    const data = await this.notificationsService.getNotifications(pilot_id, page, per_page);
    let newData = await Promise.all(data.data.map(async notification => {
      if (notification.notifiable_type === "Like") {
        notification["notifiable"] = await this.likeModel.findOne({ id: notification.notifiable_id }, {}, { populate: "pilot" }).lean();
      } else if (notification.notifiable_type === "Comment") {
        notification["notifiable"] = await this.commentModel.findOne({ id: notification.notifiable_id }, {}, { populate: "pilot" }).lean();
      } else if (notification.notifiable_type === "Post") {
        notification["notifiable"] = await this.postModel.findOne({ id: notification.notifiable_id }, {}, { populate: "pilot" }).lean();
      } else if (notification.notifiable_type === "Mention") {
        notification["notifiable"] = await this.mentionModel.findOne({ id: notification.notifiable_id }, {}, { populate: "pilot" }).lean();
      }
      return notification;
    }))
    return { data: newData, pagination: data.pagination }
  }

  async reportPilot(id: string) {
    if(isNaN(+id)) throw new BadRequestException();
    const pilot = await this.pilotsRepository.getMeById(+id);
    if(!pilot) throw new NotFoundException();
    return await this.reportModel.create({ reportable_type: "Pilot", reportable_id: +id });
}
}
