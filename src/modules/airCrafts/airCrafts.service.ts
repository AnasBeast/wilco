import { errors } from 'src/common/helpers/responses/error.helper';
import { S3Service } from './../files/s3.service';
import { AirCraftsRepository } from './airCrafts.repository';
import { Injectable, HttpException, HttpStatus, Res } from '@nestjs/common';
import { CreateAirCraftDto } from './dto/create.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AirCraftService {
  constructor(private airCraftsRepository: AirCraftsRepository, private s3Service: S3Service, private usersService: UsersService ) {}

  async create(body: CreateAirCraftDto, file?: Express.Multer.File) {
    if(file) {
      const resUpload = await this.s3Service.uploadFile(file);
      if (!resUpload) throw new HttpException(errors.FILE_UPLOAD_ERROR, HttpStatus.BAD_REQUEST);
      return await this.airCraftsRepository.create({
        ...body,
        aicraft_picture: resUpload.location,
        aircraft_picture_key: resUpload.key,
      });
    }

    return await this.airCraftsRepository.create({
      ...body
    });
  }

  async getAircraftsByPilotEmail(email: string) {
    //TODO: Change this to save on firebase
    const { _id } = await this.usersService.getUserByEmail(email);

    return await this.airCraftsRepository.getAirCraftByFilter({
      pilot_id: _id
    })
  }
}
