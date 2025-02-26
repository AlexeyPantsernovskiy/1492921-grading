import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('The «Shop» service')
    .setDescription('Shop service API')
    .setVersion('1.0')
    .build();

  const GLOBAL_PREFIX = 'api';
  app.setGlobalPrefix(GLOBAL_PREFIX);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = process.env.PORT || 3341;
  await app.listen(port);
  Logger.log(
    `🚀 Service SHOP is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
