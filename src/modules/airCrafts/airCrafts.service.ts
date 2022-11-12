import { errors } from 'src/common/helpers/responses/error.helper';
import { S3Service } from './../files/s3.service';
import { AirCraftsRepository } from './airCrafts.repository';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAirCraftDto } from './dto/create.dto';

@Injectable()
export class AirCraftService {
  constructor(private airCraftsRepository: AirCraftsRepository, private s3Service: S3Service) {}

  async create(body: CreateAirCraftDto, file: Express.Multer.File) {
    const resUpload = await this.s3Service.uploadFile(file);
    if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);

    return await this.airCraftsRepository.create({
      ...body,
      aicraft_picture: resUpload.location,
      aircraft_picture_key: resUpload.key,
    });
  }
}
