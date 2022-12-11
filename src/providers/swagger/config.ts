import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Wilco WS API V1')
  .setDescription('Wilco Web Service API - Version 1')
  .setVersion('1.0')
  .addTag('Wilco API')
  .addBearerAuth()
  .build();
