import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { UserEntity } from 'src/common/entities/user.entity';
import { SignUpDto } from './../../authentication/dto/sign-up.dto';
import { User, UserDocument } from './../../database/mongo/models/user.model';
import { Types } from "mongoose";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUserById(id: string) {
    return await this.userModel.findById(id).lean();
  }

  async getPopulatedUserById(id: string) {
    return await this.userModel.findById(id).populate("roles aircrafts").lean();
  }

  async getUserByFilter(filter: object): Promise<UserEntity> {
    return await this.userModel.findOne(filter).populate('roles home_airport').lean().exec();
  }

  async getUserDocumentByFilter(filter: FilterQuery<User>): Promise<UserDocument> {
    return await this.userModel.findOne(filter);
  }

  async getUsersByFilter(filter: object): Promise<User[]> {
    return await this.userModel.find(filter).populate('roles home_airport').exec();
  }

  async createNewUser(user): Promise<UserEntity> {
    return await this.userModel.create(user).then((user) => user.populate('roles home_airport'));
  }

  async editUser(id: string, updatedUser: UpdateQuery<User>) {
    console.log("updated user", updatedUser);
    return await this.userModel.updateOne({ _id: id}, updatedUser);
  }
}
