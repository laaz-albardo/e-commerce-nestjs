import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { errorInstaceOf } from '@src/shared';
import { UserDocument } from '../types';

@Injectable()
export class GetUserUseCase {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly repository: UserRepository) {}

  async getUserById(_id: string): Promise<UserDocument> {
    try {
      this.logger.log('get user...');

      const user = await this.repository.findOneById(_id);

      this.logger.log('user successfully');

      return user;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
