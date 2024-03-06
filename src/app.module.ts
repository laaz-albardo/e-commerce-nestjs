import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseConfig } from './config';
import { AuthModule, SeederModule, UserModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseConfig,
    UserModule,
    AuthModule,
    SeederModule,
  ],
})
export class AppModule {}
