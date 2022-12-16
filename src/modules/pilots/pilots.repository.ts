import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionFields, UpdateQuery } from 'mongoose';
import { Pilot, PilotDocument } from 'src/database/mongo/models/pilot.model';
import { User } from '../../database/mongo/models/user.model';

@Injectable()
export class PilotsRepository {
  constructor(@InjectModel(Pilot.name) private pilotModel: Model<PilotDocument>) {}

  async getMeById(id: number): Promise<PilotDocument> {
    return await this.pilotModel.findOne({ id }, {}, { populate: ["aircrafts", "certificates", "ratings", "roles"] }).select("-_id -__v").lean()
  }

  async getMeByEmail(email: string): Promise<PilotDocument> {
    return await this.pilotModel.findOne({ email });
  }

  async getPilots(page: number, per_page: number) {
    return await this.pilotModel.find({}, {}, { limit: per_page, skip: (page - 1) * per_page }).populate({ path: "aircrafts", select: "-_id" }).select("-_id");
  }

  async countPilots() {
    return await this.pilotModel.count();
  }

  async getPilotById(id: number) {
    return await this.pilotModel.findOne({ id });
  }

  async getPilotDocumentById(id: number) {
    return await this.pilotModel.findOne({ id });
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

  async getPilotsByFilter(filter: object): Promise<Pilot[]> {
    return await this.pilotModel.find(filter).lean().exec();
  }

  async createPilot(pilot): Promise<Pilot> {
    return await this.pilotModel.create(pilot);
  }

  async editPilot(id: number, updatedUser: UpdateQuery<Pilot>) {
    return await this.pilotModel.findOneAndUpdate({ id }, updatedUser, { returnDocument: "after" }).lean();
  }

  async deletePilot(id: number) {
    return await this.pilotModel.findOneAndDelete({ id });
  }
}
