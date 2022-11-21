import { SignUpDtoProfilePhotoDto } from './../../authentication/dto/sign-up.dto';
import { User, UserDocument } from './../../database/mongo/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserByFilter(filter: object): Promise<User> {
    return await this.userModel.findOne(filter).populate('role home_airport').lean().exec();
  }

  async getUsersByFilter(filter: object): Promise<User[]> {
    return await this.userModel.find(filter).populate('role home_airport').exec();
  }

  async createNewUser(user: SignUpDtoProfilePhotoDto): Promise<User> {
    return await this.userModel.create(user).then((user) => user.populate('role home_airport'));
  }
}
