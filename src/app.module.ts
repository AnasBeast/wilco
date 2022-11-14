import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/keys';
import { AppConfigModule } from './config/app/config.module';
import { MongoDBModule } from './database/mongo/database.module';

import { CommunitiesModule } from './modules/communities/communities.module';
import { DeviceModule } from './modules/device/device.module';
import { CertificateModule } from './modules/certificate/certificate.module';
import { HashtagsModule } from './modules/hashtags/hashtags.module';
import { AirportsModule } from './modules/airports/airports.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './authentication/auth.module';
import { PostsModule } from './modules/posts/posts.module';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
