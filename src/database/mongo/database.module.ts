import { connectionParams } from './../../common/helpers/mongo/connectionParams';
import { DatabaseConfigService } from './../../config/database/mongo/config.service';
import { DatabaseConfigModule } from './../../config/database/mongo/config.module';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({
  imports: [
    DatabaseConfigModule,
    MongooseModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (databaseConfigService: DatabaseConfigService) => {
        const options: MongooseModuleOptions = {
          uri: databaseConfigService.connectionUrlTest,
          ...connectionParams,
        };
        return options;
      },
    }),
  ],
})
export class MongoDBModule {}
