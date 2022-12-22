import { Body, Controller, Delete, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateDeviceDto } from 'src/dto/device/create-device.dto';
import { DeviceService } from '../device/device.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private deviceService: DeviceService) {}

  @Put('/me/device')
  async CreateOrUpdateDevice(@Req() req, @Body() { device }: CreateDeviceDto) {
    return await this.deviceService.createOrUpdateDevice(req.user.userId, device.token);
  }

  @Delete('/me/device')
  async DeleteDevice(@Req() req) {
    return await this.deviceService.deleteDevice(req.user.userId);
  }
}
