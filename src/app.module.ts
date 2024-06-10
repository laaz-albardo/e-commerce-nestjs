import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfig } from './config';
import {
  AuthModule,
  MailModule,
  SeederModule,
  UserModule,
  FileModule,
} from './modules';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot({ global: true }),
    MongooseConfig,
    UserModule,
    AuthModule,
    SeederModule,
    MailModule,
    CategoryModule,
    FileModule,
  ],
})
export class AppModule {}
