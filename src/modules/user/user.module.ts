import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas';
import { UserRepository } from './repositories';
import {
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  SaveUserAdminUseCase,
  SaveUserUseCase,
  UpdateUserUseCase,
} from './useCases';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    GetUserUseCase,
    ListUsersUseCase,
    SaveUserUseCase,
    UserRepository,
    UserService,
    UpdateUserUseCase,
    DeleteUserUseCase,
    SaveUserAdminUseCase,
  ],
  exports: [UserRepository, GetUserUseCase],
})
export class UserModule {}
