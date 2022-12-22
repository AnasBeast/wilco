import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Hashtags, HashtagsSchema } from 'src/schemas/hashtags.schema';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from "mongoose-sequence";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        name: Hashtags.name,
        useFactory: (connection: Connection) => {
          const schema = HashtagsSchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'hashtag_id_autoincrement', inc_field: 'id', start_seq: 101 });
          return schema;
        },
        inject: [getConnectionToken()]
      },
    ]),
  ],
  providers: [HashtagsService],
  controllers: [HashtagsController],
})
export class HashtagsModule {}
