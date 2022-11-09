import { AirCraftController } from './airCrafts.controller';
import { Module } from '@nestjs/common';
import { AirCraftService } from './airCrafts.service';

@Module({
  controllers: [AirCraftController],
  providers: [AirCraftService],
})
export class AirCraftModule {}
