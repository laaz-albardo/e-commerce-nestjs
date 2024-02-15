import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserShema } from './schemas';
import { UserRepository } from './repositories';
import { SaveUserUseCase } from './useCases';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserShema }]),
  ],
  controllers: [UserController],
  providers: [SaveUserUseCase, UserRepository, UserService],
  exports: [UserRepository],
})
export class UserModule {}
