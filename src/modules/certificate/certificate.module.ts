import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from 'src/schemas/certificate.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
    ]),
  ],
  providers: [CertificateService],
  controllers: [CertificateController],
})
export class CertificateModule {}
