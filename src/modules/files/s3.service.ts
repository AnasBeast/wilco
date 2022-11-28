import { AWSConfigService } from './../../config/aws/config.service';
import { Injectable } from '@nestjs/common';
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

  async uploadFile(file) {
    const { originalname } = file;

    return await this.s3_upload(file.buffer, this.awsConfigService.awsBucketName, originalname, file.mimetype);
  }

  async uploadFiles(files) {
    // const filesData = [];
    // for (let i = 0; i < files.length + 1; i++) {
    //   if (i === files.length) {
    //     return filesData;
    //   }
    //   const file = files[i];
    //   const resFile = await this.uploadFile(file);
    //   filesData.push(resFile.location);
    // }

    return files.map(async (file) => {
      return await this.uploadFile(file);
    });
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

  async s3_upload(file, bucket, name, mimetype) {
    const uploadParams = {
      Bucket: bucket,
      Key: String(new Date().getTime() + name.replace(/\s/g, '')),
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
