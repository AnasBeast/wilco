import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './authentication/auth.module';
import { TransformationInterceptor } from './authentication/interceptors/transform.interceptor';
import { AuthorizationMiddleware } from './authentication/middlewares/authorization.middleware';
import { AppConfigModule } from './config/app/config.module';
import config from './config/keys';
import { MongoDBModule } from './database/mongo/database.module';
import { AirCraftModule } from './modules/airCrafts/airCrafts.module';
import { AirportsModule } from './modules/airports/airports.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CommunitiesModule } from './modules/communities/communities.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { DeviceModule } from './modules/device/device.module';
import { FlightModule } from './modules/flights/flights.module';
import { HashtagsModule } from './modules/hashtags/hashtags.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PilotsModule } from './modules/pilots/pilots.module';
import { PostsModule } from './modules/posts/posts.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';


@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI, {
      dbName: config.db,
    }),
    AirCraftModule,
    AirportsModule,
    PostsModule,
    CommentsModule,
    CommunitiesModule,
    DeviceModule,
    CertificateModule,
    HashtagsModule,
    AppConfigModule, 
    MongoDBModule, 
    UsersModule,
    PilotsModule,
    AuthModule, 
    RolesModule, 
    FlightModule,
    NotificationsModule,
    CredentialsModule,
    MongoDBModule, 
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformationInterceptor,
    }
  ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthorizationMiddleware)
      .exclude({ path: "/api/v1/auth/login", method: RequestMethod.POST }, { path: "/api/v1/auth/register", method: RequestMethod.POST })
      .forRoutes('*')
          //.exclude('*')
    }
}
