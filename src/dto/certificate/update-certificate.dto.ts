import { BaseCertificate } from './base-certificate.dto';

export class UpdateCertificateDto extends BaseCertificate {
  completedAt: Date;
}
