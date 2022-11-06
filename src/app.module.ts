import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/keys';
import { CommunitiesModule } from './modules/communities/communities.module';
import { DeviceModule } from './modules/device/device.module';
import { CertificateModule } from './modules/certificate/certificate.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURI, {
      dbName: config.db,
    }),
    CommunitiesModule,
    DeviceModule,
    CertificateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
