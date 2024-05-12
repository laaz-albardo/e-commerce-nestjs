import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { matches } from 'class-validator';

const dbHost = (configService: ConfigService) => {
  const url = matches(
    configService.getOrThrow('MONGODB_URL'),
    /^(mongodb:\/\/|mongodb\+srv:\/\/)/,
  )
    ? configService.getOrThrow('MONGODB_URL')
    : `mongodb://${configService.getOrThrow('MONGODB_HOST')}:${configService.getOrThrow('MONGODB_PORT')}`;

  return url;
};

export const MongooseConfig: DynamicModule = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      uri: dbHost(configService),
      dbName: configService.getOrThrow('MONGODB_DBNAME'),
      user: configService.getOrThrow('MONGODB_USER'),
      pass: configService.getOrThrow('MONGODB_PASSWORD'),
    };
  },
});

export const MongooseConfigTest: DynamicModule = MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return {
      uri: dbHost(configService),
      dbName: configService.getOrThrow('MONGODB_DBTEST'),
      user: configService.getOrThrow('MONGODB_USER'),
      pass: configService.getOrThrow('MONGODB_PASSWORD'),
    };
  },
});
