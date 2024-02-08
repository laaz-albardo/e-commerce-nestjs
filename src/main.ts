import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Global prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.SERVER_PORT);
  Logger.log(
    `Welcome to ${process.env.PRODUCT_NAME}, Server run on http://127.0.0.1:${process.env.SERVER_PORT}/api`,
  );
}
bootstrap();
