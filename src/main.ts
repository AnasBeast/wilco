import { VersioningType } from '@nestjs/common';
import { swaggerConfig } from './providers/swagger/config';
import { AppConfigService } from './config/app/config.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const appConfig: AppConfigService = app.get(AppConfigService);
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api/swagger', app, document);

  app.use(cookieParser(appConfig.jwtSecret));

  app.enableCors({
    origin: appConfig.corsOrigin.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  const port = appConfig.port || 8080;
  await app.listen(port, '0.0.0.0').then(() => console.log(`Application is running on: http://localhost:${port}`));
}
bootstrap();
