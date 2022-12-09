import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionFields, UpdateQuery } from 'mongoose';
import { UserEntity } from 'src/common/entities/user.entity';
import { SignUpDto } from './../../authentication/dto/sign-up.dto';
import { User, UserDocument } from './../../database/mongo/models/user.model';
import { Types } from "mongoose";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getMe(id: string) {
    return await this.userModel.findById(id).populate(["roles", "home_airport", "aircrafts", "primary_aircraft", "communities"]).lean().exec();
  }

  async getMeByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).populate(["roles", "home_airport", "aircrafts", "primary_aircraft", "communities"]);
  }

  async getUsers(projectionFields: ProjectionFields<User>) {
    return await this.userModel.find().populate(["home_airport", "primary_aircraft"]).select(projectionFields).lean();
  }

  async getUserById(id: string) {
    return await this.userModel.findById(id).lean();
  }

  async getPopulatedUserById(id: string) {
    return await this.userModel.findById(id).populate("roles aircrafts").lean();
  }

  async getUserByFilter(filter: object, projectionFields: ProjectionFields<User>): Promise<UserEntity> {
    return await this.userModel.findOne(filter).select(projectionFields).populate('roles home_airport').lean().exec();
  }

  async getUserDocumentByFilter(filter: FilterQuery<User>): Promise<UserDocument> {
    return await this.userModel.findOne(filter);
  }

  async getUsersByFilter(filter: object, projectionFields: ProjectionFields<User>): Promise<User[]> {
    return await this.userModel.find(filter).select(projectionFields).populate('roles home_airport').exec();
  }

  async createNewUser(user): Promise<UserEntity> {
    return await this.userModel.create(user).then((user) => user.populate('roles home_airport'));
  }

  async editUser(id: string, updatedUser: UpdateQuery<User>) {
    return await this.userModel.findByIdAndUpdate(id, updatedUser, { returnDocument: "after" }).populate(["roles", "home_airport", "aircrafts", "primary_aircraft", "communities"]).lean();
  }

  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}
