import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Hashtags, HashtagsSchema } from 'src/schemas/hashtags.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hashtags.name, schema: HashtagsSchema },
    ]),
  ],
  providers: [HashtagsService],
  controllers: [HashtagsController],
})
export class HashtagsModule {}
