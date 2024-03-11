import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

const dbHost = (configService: ConfigService) => {
  return `mongodb://${configService.getOrThrow('MONGODB_HOST')}:${configService.getOrThrow('MONGODB_PORT')}`;
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
