import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseDevice } from 'src/dto/device/base-device.dto';
import { Device, DeviceDocument } from 'src/schemas/device.schema';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name)
    private readonly model: Model<DeviceDocument>,
  ) {}

  async findAll(): Promise<Device[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Device> {
    return await this.model.findById(id).exec();
  }

  async create(createTodoDto: BaseDevice): Promise<Device> {
    return await new this.model({
      ...createTodoDto,
      createdAt: new Date(),
    }).save();
  }

  async update(id: string, updateTodoDto: BaseDevice): Promise<Device> {
    return await this.model.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  async delete(id: string): Promise<Device> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
