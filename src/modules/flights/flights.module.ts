import { Module } from "@nestjs/common";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Post_Flights, FlightSchema } from "src/database/mongo/models/flight.model";
import { FlightController } from "./flights.controller";
import { FlightService } from "./flights.service";
import * as AutoIncrementFactory from "mongoose-sequence";


@Module({
    imports: [MongooseModule.forFeatureAsync([
        { 
            name: Post_Flights.name,
            useFactory: (connection: Connection) => {
                const schema = FlightSchema;
                const AutoIncrement = AutoIncrementFactory(connection);
                schema.plugin(AutoIncrement, { id: 'post_flights_id_auto_increment', inc_field: 'id', start_seq: 170 })
                return schema;
            },
            inject: [getConnectionToken()]
        }
    ])],
    controllers: [FlightController],
    providers: [FlightService],
    exports: [FlightService]
})
export class FlightModule {}