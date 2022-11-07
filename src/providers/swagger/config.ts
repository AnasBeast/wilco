import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Wilco WS API V2')
  .setDescription('Wilco Web Service API - Version 2')
  .setVersion('2.0')
  .addTag('test tag')
  .build();
