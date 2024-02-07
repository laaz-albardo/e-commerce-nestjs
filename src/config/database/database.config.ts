import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

const MongooseConfig: DynamicModule = MongooseModule.forRoot(
  process.env.MONGODB_HOST,
  {
    dbName: process.env.MONGODB_NAME,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
  },
);

export default MongooseConfig;
