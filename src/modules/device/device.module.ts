import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from 'src/schemas/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
  ],
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
