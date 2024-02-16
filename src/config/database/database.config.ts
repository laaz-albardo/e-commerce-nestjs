import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

const dbHost = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`;

export const MongooseConfig: DynamicModule = MongooseModule.forRoot(dbHost, {
  dbName: process.env.MONGODB_DBNAME,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
});

export const MongooseConfigTest: DynamicModule = MongooseModule.forRoot(
  dbHost,
  {
    dbName: process.env.MONGODB_DBTEST,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
  },
);
