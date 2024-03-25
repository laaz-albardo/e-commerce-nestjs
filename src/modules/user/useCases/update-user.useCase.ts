import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { GetUserUseCase } from './get-user.useCase';
import { UpdateUserDto } from '../dto';
import { UserDocument } from '../types';
import { User } from '../schemas';
import { errorInstaceOf } from '@src/shared';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class UpdateUserUseCase {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    private readonly repository: UserRepository,
    private readonly getUserUseCase: GetUserUseCase,
  ) {}

  async updateUser(_id: string, data: UpdateUserDto): Promise<User> {
    try {
      this.logger.log('update user...');

      const validateUser = await this.getUserUseCase.getUserById(_id);

      if (isNotEmpty(data.email)) {
        const validateEmail = await this.repository.findOne({
          email: data.email,
        });

        if (validateEmail && validateEmail.id !== validateUser.id) {
          throw new ConflictException(
            'This email is already registered with another user',
          );
        }
      }

      const updateUser = await this.repository.update(
        _id,
        data as UserDocument,
      );

      this.logger.log('user updated successfully');

      return updateUser;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
