import { BaseDevice } from './base-device.dto';

export class UpdateDeviceDto extends BaseDevice {
  completedAt: Date;
}
