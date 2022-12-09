import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { firebaseConfig } from './providers/firebase/config';
import { swaggerConfig } from './providers/swagger/config';

const fb_admin = admin.initializeApp(firebaseConfig, "test-wilco")

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // versioning
  
  app.setGlobalPrefix("/1")

  // Globally Set EveryEndpoint to use validation on inputs
  app.useGlobalPipes(new ValidationPipe());
  // For Implementing dependency injection in custom validator classes
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  //nest js transformes responses to their corresponding type for example if response type is String the response Content-Type is set to text/html
  //so there is no use for using json as a middleware
  // app.use(json({ limit: '50mb' }));
  // app.use(urlencoded({ extended: true, limit: '50mb' }));




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
export default fb_admin;
bootstrap();
