import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from "axios";
import { FilterQuery, Model } from 'mongoose';
import { errors } from 'src/common/helpers/responses/error.helper';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';
import { S3Service } from './../files/s3.service';
import { AirCraftCreate, AirCraftsRepository } from './airCrafts.repository';
import { AircraftObjectDTO, UpdateAirCraftDto, UpdateAircraftObjectDTO } from './dto/create.dto';

const api = axios.create({
  baseURL: "https://aeroapi.flightaware.com/aeroapi",
  headers: {
    "Accept-Encoding": "compress",
    "x-apikey": process.env.API_KEY
  },
  decompress: true
});

@Injectable()
export class AirCraftService {
  constructor(
    @InjectModel(AirCraft.name)
    private readonly model: Model<AirCraft>,
    private airCraftsRepository: AirCraftsRepository, private s3Service: S3Service

    ) {}

  async create(aircraft: AircraftObjectDTO, pilot_id: number) {
    const aircraftInput: AirCraftCreate = {
      pilot_id,
      ...aircraft,
    };
    
    if(aircraft.base_64_picture) {
      const resUpload = await this.s3Service.uploadFile(aircraft.base_64_picture);
      if (!resUpload) throw new BadRequestException(errors.FILE_UPLOAD_ERROR);
      aircraftInput.picture_url = resUpload.location
      aircraftInput.picture_url_key = resUpload.key
    }
 
    return await this.airCraftsRepository.create(aircraftInput);
  }

  async getAircraftByFilter(filter: FilterQuery<AirCraft>) {
    return await this.airCraftsRepository.getAirCraftByFilter(filter);
  }

  async getAircraftsByFilter(filter: FilterQuery<AirCraft>) {
    return await this.airCraftsRepository.getAirCraftsByFilter(filter);
  }

  async findTransformedAircraftsByFilter(filter: FilterQuery<AirCraft>) {
    return await this.model.find(filter).transform(res => res.map(doc => doc.id));
  }

  async getAircraftsByPilotId(pilot_id: number) {
    return await this.airCraftsRepository.getAirCraftsByFilter({
      pilot_id
    })
  }

  async getAircraftLatestFlights(aircraftId: string, pilot_id: number) {
    if(isNaN(+aircraftId)){
      throw new BadRequestException("aircraft_id should be a number");
    }
    const aircraft = await this.airCraftsRepository.getAirCraftById(+aircraftId);
    if(!aircraft) throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND);
    if(aircraft.pilot_id !== pilot_id) {
      throw new ForbiddenException(errors.PERMISSION_DENIED);
    }
    if(!aircraft.tail_number) throw new BadRequestException(errors.MISSING_TAIL_NUMBER);
    
    try {
      let data = await api.get(`/flights/${aircraft.tail_number}`)
      return data.data.flights.map(flight => ({
            external_id: flight.fa_flight_id,
            from: flight.origin?.code,
            to: flight.destination?.code ?? null,
            departure_time: flight?.actual_off,
            arrival_time: flight?.actual_on,
            max_speed: null,
            max_altitude: null,
            distance: flight.route_distance
        }));
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async editAircraft(updatedAircraft: UpdateAircraftObjectDTO, aircraftId: string, pilot_id: number) {
    if(isNaN(+aircraftId)){
      throw new BadRequestException("aircraft_id should be a number");
    }
    const aircraft = await this.airCraftsRepository.getAirCraftById(+aircraftId);
    if(!aircraft) throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND);
    if(aircraft.pilot_id !== pilot_id) throw new ForbiddenException();

    const newUpdatedAircarft: UpdateAircraftObjectDTO = {} as UpdateAircraftObjectDTO;
    
    if (updatedAircraft.make_and_model) {
      newUpdatedAircarft.make_and_model = updatedAircraft.make_and_model;
    }

    if (updatedAircraft.tail_number) {
      newUpdatedAircarft.tail_number = updatedAircraft.tail_number;
    }

    if(updatedAircraft.base_64_picture) {
      if(aircraft.picture_url_key) {
        await this.s3Service.deleteFile(aircraft.picture_url_key);
      }
      const resUpload = await this.s3Service.uploadFile(updatedAircraft.base_64_picture);
      if (!resUpload) throw new BadRequestException(errors.FILE_UPLOAD_ERROR);
      return await this.airCraftsRepository.editAircraftById(+aircraftId, { ...aircraft, ...updatedAircraft, picture_url: resUpload.location, picture_url_key: resUpload.key }, { returnDocument: 'after' });
    }

    return await this.airCraftsRepository.editAircraftById(+aircraftId, { ...aircraft, ...updatedAircraft }, { returnDocument: 'after' });
  }

  async removeAircraftFromPilot(id: string, pilotId: number) {
    if(isNaN(+id)){
      throw new BadRequestException("aircraft_id should be a number");
    }
    const aircraft = await this.airCraftsRepository.getAirCraftById(+id);
    if (!aircraft) throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND);
    if (aircraft.pilot_id !== pilotId) throw new UnauthorizedException(errors.PERMISSION_DENIED);
    if(aircraft.removed) throw new BadRequestException(errors.AIRCRAFT_ALREADY_REMOVED);

    return await this.airCraftsRepository.removeAircraft(+id);
  }
}
