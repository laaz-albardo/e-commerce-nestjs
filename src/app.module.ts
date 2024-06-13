import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfig } from './config';
import {
  AuthModule,
  CategoryModule,
  MailModule,
  ProductModule,
  SeederModule,
  UserModule,
} from './modules';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    ProductModule,
  ],
})
export class AppModule {}
