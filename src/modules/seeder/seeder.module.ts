import { Module } from '@nestjs/common';
import { User, UserRepository, UserSchema } from '../user';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserRepository],
})
export class SeederModule {}
