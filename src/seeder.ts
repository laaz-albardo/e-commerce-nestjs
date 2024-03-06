import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config';
import { User, UserRepository, UserSchema, UserSeeder } from './modules';

seeder({
  imports: [
    MongooseConfig,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository],
}).run([UserSeeder]);
