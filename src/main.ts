import { VersioningType } from '@nestjs/common';
import { swaggerConfig } from './providers/swagger/config';
import { AppConfigService } from './config/app/config.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { setup } from './setup';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  // app.setGlobalPrefix('/api/v1');
  app.setGlobalPrefix('api/v1');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  const appConfig: AppConfigService = app.get(AppConfigService);
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api/v1/swagger', app, document);

  setup(app);

  await app.listen(appConfig.port).then(() => console.log(`Application is running on: http://localhost:${appConfig.port}`));
}
bootstrap();
