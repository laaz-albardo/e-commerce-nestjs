import { seeder } from 'nestjs-seeder';
import { MongooseConfig } from './config';
import { UserModule, UserSeeder } from './modules';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot({ global: true }),
    MongooseConfig,
    UserModule,
  ],
}).run([UserSeeder]);
