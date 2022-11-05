import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // versioning 
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  // enabling swagger 
  const config = new DocumentBuilder()
    .setTitle('Wilco')
    .setDescription('Wilco WS API V1')
    .setVersion('1.0')
    .addTag('wilco-api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
