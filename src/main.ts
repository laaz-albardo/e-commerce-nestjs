import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ClassValidatorConfig } from './config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Cors
  app.enableCors({
    origin: '*',
  });

  // use validators containers
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Validations
  app.useGlobalPipes(ClassValidatorConfig);

  await app.listen(process.env.SERVER_PORT);
  Logger.log(
    `Welcome to ${process.env.PRODUCT_NAME}, Server run on http://127.0.0.1:${process.env.SERVER_PORT}/api`,
  );
}
bootstrap();
