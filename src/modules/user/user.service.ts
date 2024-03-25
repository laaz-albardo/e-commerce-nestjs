import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';
import {
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  SaveUserAdminUseCase,
  SaveUserUseCase,
  UpdateUserPasswordUseCase,
  UpdateUserUseCase,
} from './useCases';
import { UserTransformer } from './transformers';
import { BaseResponse } from '@src/shared';

@Injectable()
export class UserService {
  private readonly response: BaseResponse = new BaseResponse();

  constructor(
    private readonly saveUserUseCase: SaveUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly saveUserAdminUseCase: SaveUserAdminUseCase,
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const data = await this.saveUserUseCase.saveUser(createUserDto);

    return this.response.send(data, HttpStatus.CREATED, new UserTransformer());
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const data = await this.saveUserAdminUseCase.saveUser(createUserDto);

    return this.response.send(data, HttpStatus.CREATED, new UserTransformer());
  }

  async findAll() {
    const data = await this.listUsersUseCase.listUsers();

    return this.response.send(data, HttpStatus.OK, new UserTransformer());
  }

  async findOneById(_id: string) {
    const data = await this.getUserUseCase.getUserById(_id);

    return this.response.send(data, HttpStatus.OK, new UserTransformer());
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    const data = await this.updateUserUseCase.updateUser(_id, updateUserDto);

    return this.response.send(data, HttpStatus.ACCEPTED, new UserTransformer());
  }

  async updatePassword(
    _id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const data = await this.updateUserPasswordUseCase.updateUserPassword(
      _id,
      updateUserPasswordDto,
    );

    return this.response.send(data, HttpStatus.ACCEPTED, new UserTransformer());
  }

  async remove(_id: string) {
    const data = await this.deleteUserUseCase.deleteUser(_id);

    return this.response.send(data, HttpStatus.ACCEPTED, new UserTransformer());
  }
}
