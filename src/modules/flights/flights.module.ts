import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Post_Flights, FlightSchema } from "src/database/mongo/models/flight.model";
import { FlightController } from "./flights.controller";
import { FlightService } from "./flights.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: Post_Flights.name, schema: FlightSchema }])],
    controllers: [FlightController],
    providers: [FlightService]
})
export class FlightModule {}