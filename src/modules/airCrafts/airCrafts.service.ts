import { errors } from 'src/common/helpers/responses/error.helper';
import { S3Service } from './../files/s3.service';
import { AirCraftCreate, AirCraftsRepository } from './airCrafts.repository';
import { Injectable, HttpException, HttpStatus, Res, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { CreateAirCraftDto, UpdateAirCraftDto } from './dto/create.dto';
import { UsersService } from '../users/users.service';
import { ObjectId, Types } from "mongoose";
import axios from "axios";
import { gunzip, gzip } from 'zlib';
import { response } from 'express';
import { request } from 'http';

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
  constructor(private airCraftsRepository: AirCraftsRepository, private usersService: UsersService, private s3Service: S3Service) {}

  async create(body: CreateAirCraftDto, pilot_id: string ,file?: Express.Multer.File) {
    const aircraftInput: AirCraftCreate = {
      pilot_id,
      ...body
    };
    
    if(file) {
      const resUpload = await this.s3Service.uploadFile(file);
      if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);
      aircraftInput.aicraft_picture = resUpload.location
      aircraftInput.aircraft_picture_key = resUpload.key
    }

    const data = await this.airCraftsRepository.create(aircraftInput);
    await this.usersService.editUser(pilot_id, { $push: { aircrafts: data._id } })
    return data;
  }

  // async getAircraftsByPilotEmail(email: string) {
  //   //TODO: Change this to save on firebase
  //   const { _id } = await this.usersService.getUserByEmail(email);

  //   return await this.airCraftsRepository.getAirCraftByFilter({
  //     pilot_id: _id
  //   })
  // }

  async getAircraftsByPilotId(pilot_id: Types.ObjectId) {
    return await this.airCraftsRepository.getAirCraftsByFilter({
      pilot_id
    })
  }

  async getAircraftLatestFlights(aircraftId: string, pilot_id: string) {
    const aircraft = await this.airCraftsRepository.getAirCraftById(aircraftId);
    if(!aircraft) throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND.message, errors.AIRCRAFT_NOT_FOUND.code);
    if(aircraft.pilot_id.toString() !== pilot_id) {
      console.log(aircraft.pilot_id.toString(), pilot_id, aircraft.pilot_id.toString() !== pilot_id)
      throw new ForbiddenException(errors.PERMISSION_DENIED.message, errors.PERMISSION_DENIED.code);
    }
    if(!aircraft.tail_number) throw new BadRequestException(errors.MISSING_TAIL_NUMBER.message, errors.MISSING_TAIL_NUMBER.code);
    
    // const data = await axios.get(`https://flighttracking-production.up.railway.app/api/v1/flightsTrack/${aircraft.tail_number}`);
    try {
      let data = await api.get(`/flights/${aircraft.tail_number}`)
      return data.data.flights.map(async flight => {
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
        
        return {
            external_id: flight.fa_flight_id,
            from: flight.origin?.code,
            to: flight.destination?.code ?? null,
            departure_time: flight?.actual_off,
            arrival_time: flight?.actual_on,
            max_speed: null,
            max_altitude: null,
            distance: flight.route_distance
          }
        });
    } catch (error) {
      console.log(error);
      console.log("api key", process.env.API_KEY)
      console.log(error.request?.headers)
      console.error(error.response?.data)
    }
    

    
    // return data.data.FlightInfoExResult.flights?.map((flight) => {
    //   return {
    //     external_id: flight._id,
    //     from: flight.origin,
    //     to: flight.destination,
    //     departure_time: new Date(flight.actualdeparturetime),
    //     arrival_time: new Date(flight.actualarrivaltime),
    //     max_speed: flight.filed_airspeed_kts,
    //     max_altitude: flight.filed_altitude,
    //     distance: null
    //   }
    // })
  }

  async editAircraft({ make_and_model, tail_number }: UpdateAirCraftDto, aircraftId: string, pilot_id: Types.ObjectId, file?: Express.Multer.File) {
    const aircraft = await this.airCraftsRepository.getAirCraftById(aircraftId);
    if(!aircraft) throw new NotFoundException(errors.AIRCRAFT_NOT_FOUND.message, errors.AIRCRAFT_NOT_FOUND.code);
    
    if(file) {
      if(aircraft.aircraft_picture_key) {
        await this.s3Service.deleteFile(aircraft.aircraft_picture_key);
      }
      const resUpload = await this.s3Service.uploadFile(file);
      if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);
      return await this.airCraftsRepository.editAircraftById(aircraftId, { ...aircraft, make_and_model, tail_number, aicraft_picture: resUpload.location, aircraft_picture_key: resUpload.key }, { returnDocument: 'after' });
    }

    return await this.airCraftsRepository.editAircraftById(aircraftId, { ...aircraft, make_and_model, tail_number }, { returnDocument: 'after' });
  }

  //TODO: ASK ABOUT AIRCRAFT DELETION
}
