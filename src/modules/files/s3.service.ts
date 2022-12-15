import { AWSConfigService } from './../../config/aws/config.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk';
import { DeleteObjectRequest } from 'aws-sdk/clients/s3';

@Injectable()
export class S3Service {
  constructor(private awsConfigService: AWSConfigService) {}
  s3Client = new AWS.S3({
    region: this.awsConfigService.awsBucketRegion,
    endpoint: this.awsConfigService.awsEndpont,
    sslEnabled: true,
    s3ForcePathStyle: false,
    credentials: new Credentials({
      accessKeyId: this.awsConfigService.awsAccessKey,
      secretAccessKey: this.awsConfigService.awsSecretKey,
    }),
  });

  async parseFile(file) {
    try {
      return { 
        mimetype: file.split(';')[0].split('/')[1],
        buffer: Buffer.from(file.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async uploadFile(fileToParse) {
    const file = await this.parseFile(fileToParse);
    return await this.s3_upload(file.buffer, this.awsConfigService.awsBucketName, file.mimetype);
  }

  async uploadFiles(files) {
    return await Promise.all(files.map(async file => {
      return await this.uploadFile(file);
    }));
  }

  async deleteFile(file_name: string) {
    return await this.s3_delete(file_name, this.awsConfigService.awsBucketName);
  }

  async s3_delete(Key: string, Bucket: string) {
    try {
      return await this.s3Client.deleteObject({ Bucket, Key }).promise();
    } catch (e) {
      console.log(e);
    }
  }

  async s3_upload(file, bucket, mimetype) {
    const uploadParams = {
      Bucket: bucket,
      Key: String(new Date().getTime() + Math.floor(Math.random() * 100 + 1)) + "." + mimetype,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentEncoding: 'base64',
    };

    try {
      const { Location } = await this.s3Client.upload(uploadParams).promise();
      return { location: Location, key: uploadParams.Key };
    } catch (e) {
      console.log(e);
    }
  }
}
