import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';

import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from 'src/schemas/device.schema';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        name: Device.name,
        useFactory: async (connection: Connection) => {
          const schema = DeviceSchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'device_id_autoincrement', inc_field: 'id', start_seq: 553 })
          return schema;
        },
        inject: [getConnectionToken()]
      }
    ]),
  ],
  providers: [DeviceService],
  controllers: [DeviceController],
  exports: [DeviceService]
})
export class DeviceModule {}
