import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import MongooseConfig from './config/database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseConfig,
  ],
})
export class AppModule {}
