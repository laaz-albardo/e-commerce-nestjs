import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from '../schemas';
import { Types } from 'mongoose';

@Injectable()
export class GetUserUseCase {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly repository: UserRepository) {}

  async getUserById(_id: string): Promise<User> {
    try {
      this.logger.log('get user...');

      const validateObjectId = Types.ObjectId.isValid(_id);

      if (!validateObjectId) {
        throw new BadRequestException('Id invalid, user not found');
      }

      const user = await this.repository.findOneById(_id);

      this.logger.log('user successfully');

      return user;
    } catch (err) {
      throw err;
    }
  }
}
