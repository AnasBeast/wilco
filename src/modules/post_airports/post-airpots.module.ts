import { Module } from "@nestjs/common";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Post_Airports, Post_Airports_Schema } from "src/database/mongo/models/post-airports.model";
import * as AutoIncrementFactory from "mongoose-sequence";
import { Post_Airports_Service } from "./post-airports.service";

@Module({
    imports: [MongooseModule.forFeatureAsync([{
        name: Post_Airports.name,
        useFactory: (connection: Connection) => {
            const schema = Post_Airports_Schema;
            const AutoIncrement = AutoIncrementFactory(connection);
            schema.plugin(AutoIncrement, { id: 'post_airports_id_autoincrement', inc_field: 'id', start_seq: 57 });
            return schema;
        },
        inject: [getConnectionToken()]
    }])],
    providers: [Post_Airports_Service],
    exports: [Post_Airports_Service]
})
export class Post_Airports_Module {}