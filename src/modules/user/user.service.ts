import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ListUsersUseCase, SaveUserUseCase } from './useCases';
import { UserTransformer } from './transformers';

@Injectable()
export class UserService {
  constructor(
    private readonly saveUserUseCase: SaveUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
