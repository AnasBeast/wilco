import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Airport, AirportSchema } from './../../database/mongo/models/airport.model';
import { AirportsRepository } from './airports.repository';
import { AirportsService } from './airports.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Airport.name, schema: AirportSchema }])],
  providers: [AirportsService, AirportsRepository],
  exports: [AirportsService],
})
export class AirportsModule {}
