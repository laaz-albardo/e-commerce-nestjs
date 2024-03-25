import { Injectable } from '@nestjs/common';
import { LoginUseCase } from './useCases';
import { GetUserUseCase, IUser, User } from '../user';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async login(user: any): Promise<any> {
    return this.loginUseCase.loginUser(user);
  }

  async profile(user: IUser): Promise<User> {
    return await this.getUserUseCase.getUserById(user._id as string);
  }
}
