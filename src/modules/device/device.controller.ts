import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseDevice } from 'src/dto/device/base-device.dto';
import { DeviceService } from './device.service';

@Controller('devices')
@ApiTags('devices')
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  @Get()
  @ApiOperation({ summary: 'Get List of Devices' })
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseDevice],
  })
  async index() {
    return await this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Device' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseDevice,
  })
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create Device' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseDevice,
  })
  async create(@Body() createTodoDto: BaseDevice) {
    return await this.service.create(createTodoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Device' })
  @ApiResponse({
    status: 200,
    description: 'The record updated',
    type: BaseDevice,
  })
  async update(@Param('id') id: string, @Body() updateTodoDto: BaseDevice) {
    return await this.service.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Device' })
  @ApiResponse({
    status: 200,
    description: 'The record deleted',
    type: BaseDevice,
  })
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
