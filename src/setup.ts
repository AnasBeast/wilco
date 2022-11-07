import { AppConfigService } from './config/app/config.service';
import { ValidationPipe, HttpStatus, INestApplication } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as connectPgSimple from 'connect-pg-simple';
import * as session from 'express-session';

import { AppModule } from './app.module';

export function setup(app: INestApplication): INestApplication {
  const appConfig: AppConfigService = app.get(AppConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );

  app.use(cookieParser(appConfig.jwtSecret));

  app.use(
    session({
      secret: appConfig.jwtSecret,
      resave: false,
      saveUninitialized: false,
      store: process.env.NODE_ENV === 'production' ? new (connectPgSimple(session))() : new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.enableCors({
    // origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    origin: '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
