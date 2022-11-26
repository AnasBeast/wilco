import { Module } from '@nestjs/common';
import { AppConfigModule } from './../config/app/config.module';
import { UsersModule } from './../modules/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // JwtAuthGuard,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard}
  ],
  exports: [AuthService], // JwtAuthGuard 
})
export class AuthModule {}
