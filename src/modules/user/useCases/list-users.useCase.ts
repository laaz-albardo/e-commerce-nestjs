import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from '../schemas';
import { CustomErrorException } from '@src/shared';

@Injectable()
export class ListUsersUseCase {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly repository: UserRepository) {}

  async listUsers(): Promise<User[]> {
    try {
      this.logger.log('list users...');

      const users = await this.repository.findAll();

      this.logger.log('users listed successfully');

      return users;
    } catch (err) {
      throw new CustomErrorException(err);
    }
  }
}
