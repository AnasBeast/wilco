import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FlightDocument, Post_Flights } from "src/database/mongo/models/flight.model";
import { FlightDTO } from "src/dto/post/create-post.dto";
import { PostFlightDocument } from "src/schemas/post-flight.schema";
import axios from "axios";

const api = axios.create({
    baseURL: "https://aeroapi.flightaware.com/aeroapi",
    headers: {
      "Accept-Encoding": "compress",
      "x-apikey": process.env.API_KEY
    },
    decompress: true
})

@Injectable()
export class FlightService {
    constructor(@InjectModel(Post_Flights.name) private flightModel: Model<FlightDocument>) {}

    async createPostFlight(body: FlightDTO) {
        return await this.flightModel.create(body);
    }

    async getLatestFlights(aircraft_ids: number[]) {
        return await this.flightModel.find({ aircraft_id: { $in: aircraft_ids } }).populate({ path: "aircraft", select:"-_id" }).select("-_id");
    }

    async getTrack(id: string, height: number, width: number) {
        try {
            const data = await api.get(`/flights/${id}/map?height=${height}&width=${width}`);
            return { track_base_64: data.data.map };
        } catch (e) {
            throw new BadRequestException()    
        }           
    }
}