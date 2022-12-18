import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { connectionParams } from './../../common/helpers/mongo/connectionParams';
import { DatabaseConfigModule } from './../../config/database/mongo/config.module';
import { DatabaseConfigService } from './../../config/database/mongo/config.service';

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
