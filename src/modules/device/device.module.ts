import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Device, DeviceSchema } from 'src/schemas/device.schema';
import { DeviceService } from './device.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { 
        name: Device.name,
        useFactory: async (connection: Connection) => {
          const schema = DeviceSchema;
          const autoIncrement = AutoIncrementFactory(connection);
          schema.plugin(autoIncrement, { id: 'device_id_autoincrement', inc_field: 'id', start_seq: 660 })
          return schema;
        },
        inject: [getConnectionToken()]
      }
    ]),
  ],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {}
