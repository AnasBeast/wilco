import { DatabaseConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import * as Joi from '@hapi/joi';
import mongoose from 'mongoose';

mongoose.set('debug', true);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MONGO_URL: Joi.string().default('mongo_url'),
        MONGO_URL_TEST: Joi.string().default('mongo_url_test'),
      }),
    }),
  ],
  providers: [ConfigService, DatabaseConfigService],
  exports: [ConfigService, DatabaseConfigService],
})
export class DatabaseConfigModule {}
