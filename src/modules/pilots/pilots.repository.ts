import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, FilterQuery, Model, PipelineStage, ProjectionFields, UpdateQuery } from 'mongoose';
import { CommunityTagsDocument, Community_tags } from 'src/database/mongo/models/community_tags.model';
import { Pilot, PilotDocument } from 'src/database/mongo/models/pilot.model';

@Injectable()
export class PilotsRepository {
  constructor(@InjectModel(Pilot.name) private pilotModel: Model<PilotDocument>, @InjectModel(Community_tags.name) private communityTagsModel: Model<CommunityTagsDocument>) {}

  async getMeById(id: number) {
    return await this.pilotModel.findOne({ id }, {}, { populate: [{path: "aircrafts"}, {path:"certificates", populate: { path:"certificate", select: "id name custom -_id" }, transform: (doc) => doc.certificate }, {path:"ratings", populate: { path:"rating", select: "id name custom -_id" }, transform: (doc) => doc.rating }, {path:"roles", populate: { path:"role", select: "id name custom created_at updated_at -_id" }, transform: (doc) => doc.role },{path:"community_tags", populate: { path:"community", select: "name -_id" }, transform: (doc) => doc.community.name }] }).select("-_id -__v").lean()
  }

  async getMeByEmail(email: string): Promise<PilotDocument> {
    return await this.pilotModel.findOne({ email });
  }

  async getPilots(page: number, per_page: number) {
    return await this.pilotModel.find({}, {}, { limit: per_page, skip: (page - 1) * per_page, populate: [{path: "aircrafts"}, {path:"certificates", populate: { path:"certificate", select: "id name custom -_id" }, transform: (doc) => doc?.certificate }, {path:"ratings", populate: { path:"rating", select: "id name custom -_id" }, transform: (doc) => doc?.rating }, {path:"roles", populate: { path:"role", select: "id name custom created_at updated_at -_id" }, transform: (doc) => doc?.role },{path:"community_tags", populate: { path:"community", select: "name -_id" }, transform: (doc) => doc?.community?.name }] }).select("-_id");
  }

  async countPilots() {
    return await this.pilotModel.count();
  }

  async getPilotById(id: number) {
    return await this.pilotModel.findOne({ id },{}, { populate: [{path: "aircrafts"}, {path:"certificates", populate: { path:"certificate", select: "id name custom -_id" }, transform: (doc) => doc.certificate }, {path:"ratings", populate: { path:"rating", select: "id name custom -_id" }, transform: (doc) => doc.rating }, {path:"roles", populate: { path:"role", select: "id name custom created_at updated_at -_id" }, transform: (doc) => doc.role },{path:"community_tags", populate: { path:"community", select: "name -_id" }, transform: (doc) => doc.community.name }] }).select("-_id -__v").lean();
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

  async getPilotsByCommnityTags(community_ids: number[], page: number, per_page: number) {
    const pilot_ids = await this.communityTagsModel.find({ community_id: { $in: community_ids }, taggable_type: "Pilot" },{}, { skip: (page - 1) * per_page, limit: per_page }).transform(res => res.map(doc => doc.taggable_id));
    return await this.pilotModel.find({ id: { $in: pilot_ids } }).populate("aircrafts");
  }

  async getPilotsCountByCommnityTags(community_ids: number[]) {
    return await this.communityTagsModel.find({ community_id: { $in: community_ids }, taggable_type: "Pilot" }).count();
  }

  async getPilotDocumentByFilter(filter: FilterQuery<Pilot>): Promise<PilotDocument> {
    return await this.pilotModel.findOne(filter);
  }

  async getPilotsByFilter(filter: object, page: number, per_page: number): Promise<Pilot[]> {
    return await this.pilotModel.find(filter, {}, { skip: (page - 1) * per_page, limit: per_page }).populate("aircrafts");
  }

  async getPilotsCountByFilter(filter: object): Promise<number> {
    return await this.pilotModel.find(filter).count();
  }

  async createPilot(pilot): Promise<PilotDocument> {
    return await this.pilotModel.create(pilot);
  }

  async editPilot(id: number, updatedUser: UpdateQuery<Pilot>) {
    return await this.pilotModel.findOneAndUpdate({ id }, updatedUser, { returnDocument: "after", populate: [{path: "aircrafts"}, {path:"certificates", populate: { path:"certificate", select: "id name custom -_id" }, transform: (doc) => doc.certificate }, {path:"ratings", populate: { path:"rating", select: "id name custom -_id" }, transform: (doc) => doc.rating }, {path:"roles", populate: { path:"role", select: "id name custom created_at updated_at -_id" }, transform: (doc) => doc.role },{path:"community_tags", populate: { path:"community", select: "name -_id" }, transform: (doc) => doc.community.name }] }).lean();
  }

  async deletePilot(id: number) {
    return await this.pilotModel.findOneAndDelete({ id }, { populate: [{path: "aircrafts"}, {path:"certificates", populate: { path:"certificate", select: "id name custom -_id" }, transform: (doc) => doc.certificate }, {path:"ratings", populate: { path:"rating", select: "id name custom -_id" }, transform: (doc) => doc.rating }, {path:"roles", populate: { path:"role", select: "id name custom created_at updated_at -_id" }, transform: (doc) => doc.role },{path:"community_tags", populate: { path:"community", select: "name -_id" }, transform: (doc) => doc.community.name }] });
  }
}
