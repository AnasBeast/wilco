import { Airport, AirportSchema } from './../../database/mongo/models/airport.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AirportsRepository } from './airports.repository';
import { Module } from '@nestjs/common';
import { AirportsController } from './airports.controller';
import { AirportsService } from './airports.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Airport.name, schema: AirportSchema }])],
  controllers: [AirportsController],
  providers: [AirportsService, AirportsRepository],
  exports: [AirportsService],
})
export class AirportsModule {}
