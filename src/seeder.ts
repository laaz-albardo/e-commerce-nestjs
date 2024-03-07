import { seeder } from 'nestjs-seeder';
import { MongooseConfig } from './config';
import { UserModule, UserSeeder } from './modules';

seeder({
  imports: [MongooseConfig, UserModule],
}).run([UserSeeder]);
