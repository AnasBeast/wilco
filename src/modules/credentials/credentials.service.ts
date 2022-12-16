import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Rating, RatingDocument } from "src/database/mongo/models/rating.model";
import { Certificate, CertificateDocument } from "src/schemas/certificate.schema";

@Injectable()
export class CredentialsService {
    constructor (@InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>,@InjectModel(Rating.name) private ratingModel: Model<RatingDocument>) {}

    async getCredentials() {
        const certificates = await this.certificateModel.find().select("-_id -custom -index");
        const ratings = await this.ratingModel.find().select("-_id -custom");
        return { certificates, ratings };
    }
}