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
import cookieParser from 'cookie-parser';

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
    credentials: true,
  });

  // use validators containers
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Validations
  app.useGlobalPipes(ClassValidatorConfig);

  // fastify cookies
  app.use(cookieParser());
  await app.register(fastifyCookie, {
    parseOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    },
    secret: process.env.JWT_SECRET,
  });

  await app.register(compression);
  await app.register(contentParser);

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  await app.listen(process.env.SERVER_PORT, '0.0.0.0');
  Logger.log(
    `Welcome to ${process.env.PRODUCT_NAME}, Server run on http://127.0.0.1:${process.env.SERVER_PORT}/api`,
  );
}
bootstrap();
