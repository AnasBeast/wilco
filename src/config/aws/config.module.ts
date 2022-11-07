import { AWSConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        AWS_BUCKET_NAME: Joi.string().default('Bucket name'),
        AWS_ENDPOINT: Joi.string().default('http://localhost:8080'),
        AWS_BUCKET_REGION: Joi.string().default('us'),
        AWS_ACCESS_KEY: Joi.string().default('secret'),
        AWS_SECRET_KEY: Joi.string().default('secret'),
      }),
    }),
  ],
  providers: [ConfigService, AWSConfigService],
  exports: [ConfigService, AWSConfigService],
})
export class AWSConfigModule {}
