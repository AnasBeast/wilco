import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionFields, UpdateQuery } from 'mongoose';
import { Pilot, PilotDocument } from 'src/database/mongo/models/pilot.model';
import { User } from '../../database/mongo/models/user.model';

@Injectable()
export class PilotsRepository {
  constructor(@InjectModel(Pilot.name) private pilotModel: Model<PilotDocument>) {}

  async getMeById(id: string): Promise<PilotDocument> {
    return await this.pilotModel.findOne({ id });
  }

  async getMeByEmail(email: string): Promise<PilotDocument> {
    return await this.pilotModel.findOne({ email });
  }

  async getPilots(page: number, per_page: number) {
    return await this.pilotModel.find({}, {}, { limit: per_page, skip: (page - 1)*per_page }).lean();
  }

  async getPilotById(id: string) {
    return await this.pilotModel.findById(id).lean();
  }

  async getPilotDocumentById(id: string) {
    return await this.pilotModel.findById(id);
  }

  // async getPopulatedUserById(id: string) {
  //   return await this.pilotModel.findById(id).populate("roles aircrafts").lean();
  // }

  async getPilotByFilter(filter: FilterQuery<Pilot>, projectionFields: ProjectionFields<Pilot>): Promise<Pilot> {
    return await this.pilotModel.findOne(filter).select(projectionFields).lean().exec();
  }

  async getPilotDocumentByFilter(filter: FilterQuery<Pilot>): Promise<PilotDocument> {
    return await this.pilotModel.findOne(filter);
  }

  async getPilotsByFilter(filter: object, projectionFields: ProjectionFields<Pilot>): Promise<Pilot[]> {
    return await this.pilotModel.find(filter).select(projectionFields).exec();
  }

  async createNewUser(user): Promise<Pilot> {
    return await this.pilotModel.create(user);
  }

  async editPilot(id: string, updatedUser: UpdateQuery<Pilot>) {
    return await this.pilotModel.findByIdAndUpdate(id, updatedUser, { returnDocument: "after" }).lean();
  }

  async deletePilot(id: string) {
    return await this.pilotModel.findOneAndDelete({ id });
  }
}
