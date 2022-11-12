import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  awsBucketName: process.env.AWS_BUCKET_NAME,
  awsEndpont: process.env.AWS_ENDPOINT,
  awsBucketRegion: process.env.AWS_BUCKET_REGION,
  awsAccessKey: process.env.AWS_ACCESS_KEY,
  awsSecretKey: process.env.AWS_SECRET_KEY,
}));
