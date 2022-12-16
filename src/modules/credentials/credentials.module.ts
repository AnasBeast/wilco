import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Rating, RatingSchema } from "src/database/mongo/models/rating.model";
import { Certificate, CertificateSchema } from "src/schemas/certificate.schema";
import { CrendentialsController } from "./credentials.controller";
import { CredentialsService } from "./credentials.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Certificate.name, schema: CertificateSchema }, { name: Rating.name, schema: RatingSchema }])],
    controllers: [CrendentialsController],
    providers: [CredentialsService]
})
export class CredentialsModule {}