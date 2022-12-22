import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Hashtags, HashtagsSchema } from 'src/schemas/hashtags.schema';
import { HashtagsController } from './hashtags.controller';
import { HashtagsService } from './hashtags.service';

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
