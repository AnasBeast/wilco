import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './authentication/auth.module';
import { MongoDBModule } from './database/mongo/database.module';
import { AppConfigModule } from './config/app/config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, MongoDBModule, UsersModule, AuthModule, RolesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
