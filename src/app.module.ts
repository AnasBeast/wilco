import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './config/app/config.module';
import config from './config/keys';
import { MongoDBModule } from './database/mongo/database.module';

import { AuthModule } from './authentication/auth.module';
import { AirportsModule } from './modules/airports/airports.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { CommunitiesModule } from './modules/communities/communities.module';
import { DeviceModule } from './modules/device/device.module';
import { HashtagsModule } from './modules/hashtags/hashtags.module';
import { PostsModule } from './modules/posts/posts.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthorizationMiddleware } from './authentication/middlewares/authorization.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI, {
      dbName: config.db,
    }),
    CommunitiesModule,
    DeviceModule,
    CertificateModule,
    HashtagsModule,
    AppConfigModule, 
    MongoDBModule, 
    UsersModule, 
    AuthModule, 
    RolesModule, 
    AirportsModule,
    PostsModule
  ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthorizationMiddleware)
      .exclude({ path: "/api/v1/auth/register", method: RequestMethod.POST })
      .forRoutes('*')
    }
}
