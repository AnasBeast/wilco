import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post_Airports, Post_Airports_Document } from "src/database/mongo/models/post-airports.model";

@Injectable()
export class Post_Airports_Service {
    constructor(@InjectModel(Post_Airports.name) private postAirportsModel: Model<Post_Airports_Document>) {}

    async createPostAirport(input: Post_Airports) {
        return await this.postAirportsModel.create(input);
    }
}