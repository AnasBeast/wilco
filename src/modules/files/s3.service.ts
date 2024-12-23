import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Credentials } from 'aws-sdk';
import { AWSConfigService } from './../../config/aws/config.service';

@Injectable()
export class S3Service {
  constructor(private awsConfigService: AWSConfigService) { }
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
      const base64Value = file
        .replace(/^data:image\/\w+;base64,/, '')
        .replace(/^data:video\/\w+;base64,/, '')

      return {
        mimetype: file.split(';')[0].split('/')[1],
        buffer: Buffer.from(base64Value, 'base64'),
        contenttype: file.split(';')[0].split(':')[1]
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async uploadFile(fileToParse) {
    const file = await this.parseFile(fileToParse);
    return await this.s3_upload(file.buffer, this.awsConfigService.awsBucketName, file.mimetype, file.contenttype);
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

  async s3_upload(file, bucket, mimetype, contenttype) {
    const uploadParams = {
      Bucket: bucket,
      Key: String(new Date().getTime() + Math.floor(Math.random() * 100 + 1)) + "." + mimetype,
      Body: file,
      ACL: 'public-read',
      ContentType: contenttype,
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
