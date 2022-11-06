import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseCertificate } from 'src/dto/certificate/base-certificate.dto';
import {
  Certificate,
  CertificateDocument,
} from 'src/schemas/certificate.schema';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly model: Model<CertificateDocument>,
  ) {}

  async findAll(): Promise<Certificate[]> {
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<Certificate> {
    return await this.model.findById(id).exec();
  }

  async create(createTodoDto: BaseCertificate): Promise<Certificate> {
    return await new this.model({
      ...createTodoDto,
      createdAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    updateTodoDto: BaseCertificate,
  ): Promise<Certificate> {
    return await this.model.findByIdAndUpdate(id, updateTodoDto).exec();
  }

  async delete(id: string): Promise<Certificate> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}