import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AWSConfigService {
  constructor(private configService: ConfigService) {}

  get awsBucketName(): string {
    return this.configService.get<string>('aws.awsBucketName');
  }
  get awsEndpont(): string {
    return this.configService.get<string>('aws.awsEndpont');
  }
  get awsBucketRegion(): string {
    return this.configService.get<string>('aws.awsBucketRegion');
  }
  get awsAccessKey(): string {
    return this.configService.get<string>('aws.awsAccessKey');
  }
  get awsSecretKey(): string {
    return this.configService.get<string>('aws.awsSecretKey');
  }
}
