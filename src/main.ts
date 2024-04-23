import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ClassValidatorConfig } from './config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import compression from '@fastify/compress';
import fastifyCookie from '@fastify/cookie';
import { contentParser } from 'fastify-file-interceptor';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
    },
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // use validators containers
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Validations
  app.useGlobalPipes(ClassValidatorConfig);

  await app.register(compression);
  await app.register(fastifyCookie, { parseOptions: { httpOnly: true } });
  await app.register(contentParser);

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  await app.listen(process.env.SERVER_PORT);
  Logger.log(
    `Welcome to ${process.env.PRODUCT_NAME}, Server run on http://127.0.0.1:${process.env.SERVER_PORT}/api`,
  );
}
bootstrap();
