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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get List of Devices' })
  @ApiResponse({
    status: 200,
    description: 'The records found',
    type: [BaseDevice],
  })
  @Get()
  async index() {
    return await this.service.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Device' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseDevice,
  })
  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.findOne(id);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Device' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: BaseDevice,
  })
  @Post()
  async create(@Body() createTodoDto: BaseDevice) {
    return await this.service.create(createTodoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Device' })
  @ApiResponse({
    status: 200,
    description: 'The record updated',
    type: BaseDevice,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: BaseDevice) {
    return await this.service.update(id, updateTodoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Device' })
  @ApiResponse({
    status: 200,
    description: 'The record deleted',
    type: BaseDevice,
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
