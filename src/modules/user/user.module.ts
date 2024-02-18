import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserShema } from './schemas';
import { UserRepository } from './repositories';
import { GetUserUseCase, ListUsersUseCase, SaveUserUseCase } from './useCases';
import { DeleteUserUseCase } from './useCases/delete-user.useCase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserShema }]),
  ],
  controllers: [UserController],
  providers: [
    GetUserUseCase,
    ListUsersUseCase,
    SaveUserUseCase,
    UserRepository,
    UserService,
    DeleteUserUseCase,
  ],
  exports: [UserRepository],
})
export class UserModule {}
