import { AirCraftController } from './airCrafts.controller';
import { Module } from '@nestjs/common';
import { AirCraftService } from './airCrafts.service';
import { AirCraftsRepository } from './airCrafts.repository';
import { S3Module } from '../files/s3.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AirCraft, AirCraftSchema } from 'src/database/mongo/models/airCraft.model';
import { UsersModule } from '../users/users.module';
import { PilotsModule } from '../pilots/pilots.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: AirCraft.name, schema: AirCraftSchema }]), S3Module],
  controllers: [AirCraftController],
  providers: [AirCraftService, AirCraftsRepository],
  exports: [AirCraftService]
})
export class AirCraftModule {}
