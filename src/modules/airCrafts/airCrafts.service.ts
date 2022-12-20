import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import axios from "axios";
import { errors } from 'src/common/helpers/responses/error.helper';
import { S3Service } from './../files/s3.service';
import { AirCraftCreate, AirCraftsRepository } from './airCrafts.repository';
import { AircraftObjectDTO, UpdateAirCraftDto, UpdateAircraftObjectDTO } from './dto/create.dto';
import { FilterQuery } from 'mongoose';
import { AirCraft } from 'src/database/mongo/models/airCraft.model';

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
  constructor(private airCraftsRepository: AirCraftsRepository, private s3Service: S3Service) {}

  async create(aircraft: AircraftObjectDTO, pilot_id: number) {
    const aircraftInput: AirCraftCreate = {
      pilot_id,
      ...aircraft,
    };
    
    if(aircraft.base_64_picture) {
      const resUpload = await this.s3Service.uploadFile(aircraft.base_64_picture);
      if (!resUpload) throw new BadRequestException(errors.FILE_UPLOAD_ERROR);
      aircraftInput.aicraft_picture = resUpload.location
      aircraftInput.aircraft_picture_key = resUpload.key
    }
 
    return await this.airCraftsRepository.create(aircraftInput);
  }

  async getAircraftByFilter(filter: FilterQuery<AirCraft>) {
    return await this.airCraftsRepository.getAirCraftByFilter(filter);
  }

  // async getAircraftsByPilotEmail(email: string) {
  //   //TODO: Change this to save on firebase
  //   const { _id } = await this.pilotsService.getUserByEmail(email);

  //   return await this.airCraftsRepository.getAirCraftByFilter({
  //     pilot_id: _id
  //   })
  // }

  async getAircraftsByPilotId(pilot_id: number) {
    return await this.airCraftsRepository.getAirCraftsByFilter({
      pilot_id
    })
  }

  async getAircraftLatestFlights(aircraftId: number, pilot_id: number) {
    const aircraft = await this.airCraftsRepository.getAirCraftById(aircraftId);
    if(!aircraft) throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND);
    if(aircraft.pilot_id !== pilot_id) {
      throw new ForbiddenException(errors.PERMISSION_DENIED);
    }
    if(!aircraft.tail_number) throw new BadRequestException(errors.MISSING_TAIL_NUMBER);
    
    // const data = await axios.get(`https://flighttracking-production.up.railway.app/api/v1/flightsTrack/${aircraft.tail_number}`);
    // let maxSpeed = 0;
    // let maxAltitude = 0;
    // try {
    //   let track = await api.get(`/flights/${flight.fa_flight_id}/track`);
    //   track.data.map(track => {
    //     if (track.groundspeed > maxSpeed) maxSpeed = track.groundspeed;
    //     if (track.altitude > maxAltitude) maxAltitude = track.altitude;
    //   })
    // } catch (error) {
    //   console.log(error);
    // }
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
      console.log(error);
      console.log("api key", process.env.API_KEY)
      console.log(error.request?.headers)
      console.error(error.response?.data)
    }
    

    
  }

  async editAircraft({ aircraft: updatedAircraft }: UpdateAirCraftDto, aircraftId: number, pilot_id: number) {
    const aircraft = await this.airCraftsRepository.getAirCraftById(aircraftId);
    if(!aircraft) throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND);
    if(aircraft.pilot_id !== pilot_id) throw new ForbiddenException();

    const newUpdatedAircarft: UpdateAircraftObjectDTO = {} as UpdateAircraftObjectDTO;
    
    if (updatedAircraft.make_and_model) {
      newUpdatedAircarft.make_and_model = updatedAircraft.make_and_model;
    }

    if (updatedAircraft.tail_number) {
      newUpdatedAircarft.tail_number = updatedAircraft.tail_number;
    }

    // if(file) {
    //   if(aircraft.aircraft_picture_key) {
    //     await this.s3Service.deleteFile(aircraft.aircraft_picture_key);
    //   }
    //   const resUpload = await this.s3Service.uploadFile(file);
    //   if (!resUpload) throw new BadRequestException(errors.FILE_UPLOAD_ERROR);
    //   return await this.airCraftsRepository.editAircraftById(aircraftId, { ...aircraft, ...updatedAircraft, aicraft_picture: resUpload.location, aircraft_picture_key: resUpload.key }, { returnDocument: 'after' });
    // }

    return await this.airCraftsRepository.editAircraftById(aircraftId, { ...aircraft, ...updatedAircraft }, { returnDocument: 'after' });
  }

  //TODO: ASK ABOUT AIRCRAFT DELETION
  async removeAircraftFromPilot(id: number, pilotId: number) {
    const aircraft = await this.airCraftsRepository.getAirCraftById(id);
    if (!aircraft) {
      throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND);
    }
    if (aircraft.pilot_id !== pilotId) {
      throw new UnauthorizedException(errors.PERMISSION_DENIED);
    }
    if(aircraft.removed) {
      throw new BadRequestException(errors.AIRCRAFT_ALREADY_REMOVED);
    }

    return await this.airCraftsRepository.removeAircraft(id);
  }
}
