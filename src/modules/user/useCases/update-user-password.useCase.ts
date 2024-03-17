import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { GetUserUseCase } from './get-user.useCase';
import { UpdateUserPasswordDto } from '../dto';
import { UserDocument } from '../types';
import { User } from '../schemas';
import { errorInstaceOf } from '@src/shared';
import { compare } from 'bcrypt';

@Injectable()
export class UpdateUserPasswordUseCase {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private readonly repository: UserRepository,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async updateUserPassword(
    _id: string,
    data: UpdateUserPasswordDto,
  ): Promise<User> {
    try {
      this.logger.log('update user password...');

      const validateUser = await this.getUserUseCase.getUserById(_id);

      if (await compare(data.password, validateUser.password)) {
        throw new BadRequestException(
          'The password cannot be the same as the previous one',
        );
      }

      const updateUserPassword = await this.repository.update(
        _id,
        data as UserDocument,
      );

      this.logger.log('user password updated successfully');

      return updateUserPassword;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
