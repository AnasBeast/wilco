import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionFields, UpdateQuery } from 'mongoose';
import { UserEntity } from 'src/common/entities/user.entity';
import { SignUpDto } from '../../authentication/dto/sign-up.dto';
import { Pilot, PilotDocument } from '../../database/mongo/models/pilot.model';
import { Types } from "mongoose";
import { User, UserDocument } from 'src/database/mongo/models/user.model';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  
  async getMe(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email }).lean();
  }

  async getMeById(id: string): Promise<User> {
    return await this.userModel.findById(id).lean();
  }

 /*
  async getMeByEmail(email: string): Promise<PilotDocument> {
    return await this.pilotModel.findOne({ email }).populate(["roles", "home_airport", "aircrafts", "primary_aircraft", "communities"]);
  }

  async getUsers(projectionFields: ProjectionFields<User>) {
    return await this.pilotModel.find().populate(["home_airport", "primary_aircraft"]).select(projectionFields).lean();
  }

  async getUserById(id: string) {
    return await this.pilotModel.findById(id).lean();
  }
*/
  async getPopulatedUserById(id: string) {
    return await this.userModel.findOne({id: id}).populate("pilot").lean();
  }
/*
  async getUserByFilter(filter: object, projectionFields: ProjectionFields<User>): Promise<UserEntity> {
    return await this.pilotModel.findOne(filter).select(projectionFields).populate('roles home_airport').lean().exec();
  }

  async getPilotDocumentByFilter(filter: FilterQuery<User>): Promise<PilotDocument> {
    return await this.pilotModel.findOne(filter);
  }

  async getUsersByFilter(filter: object, projectionFields: ProjectionFields<User>): Promise<User[]> {
    return await this.pilotModel.find(filter).select(projectionFields).populate('roles home_airport').exec();
  }

  async createNewUser(user): Promise<UserEntity> {
    return await this.pilotModel.create(user).then((user) => user.populate('roles home_airport'));
  }

  async editUser(id: string, updatedUser: UpdateQuery<User>) {
    return await this.pilotModel.findByIdAndUpdate(id, updatedUser, { returnDocument: "after" }).populate(["roles", "home_airport", "aircrafts", "primary_aircraft", "communities"]).lean();
  }

  async deleteUser(id: string) {
    return await this.pilotModel.findByIdAndDelete(id);
  }
  */
}
