import { Injectable, NotFoundException } from '@nestjs/common';
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
  
  async createOrUpdateDevice(user_id: number, token: string) {
    const device = await this.model.findOne({ user_id });
    if(!device) {
      const device = await this.model.create({ token, user_id })
      return { id: device.id, token: device.token }
    };
    device.token = token;
    await device.save();
    return { id: device.id, token } 
  }

  async deleteDevice(user_id: number) {
    const device = await this.model.findOne({ user_id });
    if (!device) throw new NotFoundException();
    await device.delete();
    return { id: device.id, token: device.token };
  }

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
