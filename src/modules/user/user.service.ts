import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  SaveUserUseCase,
  UpdateUserUseCase,
} from './useCases';
import { UserTransformer } from './transformers';

@Injectable()
export class UserService {
  constructor(
    private readonly saveUserUseCase: SaveUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let data = await this.saveUserUseCase.saveUser(createUserDto);

    data = await new UserTransformer().handle(data);

    return data;
  }

  async findAll() {
    let data = await this.listUsersUseCase.listUsers();

    data = await new UserTransformer().handle(data);

    return data;
  }

  async findOneById(_id: string) {
    let data = await this.getUserUseCase.getUserById(_id);

    data = await new UserTransformer().handle(data);

    return data;
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    let data = await this.updateUserUseCase.updateUser(_id, updateUserDto);

    data = await new UserTransformer().handle(data);

    return data;
  }

  async remove(_id: string) {
    let data = await this.deleteUserUseCase.deleteUser(_id);

    data = await new UserTransformer().handle(data);

    return {
      message: 'User deleted',
      data,
    };
  }
}
