import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { GetUserUseCase } from './get-user.useCase';
import { CustomErrorException } from '@src/shared';

@Injectable()
export class DeleteUserUseCase {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private readonly repository: UserRepository,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async deleteUser(_id: string) {
    try {
      this.logger.log('delete user...');

      await this.getUserUseCase.getUserById(_id);

      const deleteUser = await this.repository.delete(_id);

      this.logger.log('user deleted successfully');

      return deleteUser;
    } catch (err) {
      throw new CustomErrorException(err);
    }
  }
}
