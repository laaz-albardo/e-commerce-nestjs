import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserDto } from '../dto';
import { User } from '../schemas';
import { CustomErrorException } from '@src/shared';

@Injectable()
export class SaveUserUseCase {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly repository: UserRepository) {}

  async saveUser(data: CreateUserDto): Promise<User> {
    try {
      this.logger.log('creating user...');

      const validateUserEmail = await this.repository.findOne({
        email: data.email,
      });

      if (validateUserEmail) {
        throw new ConflictException(`${validateUserEmail.email} registered`);
      }

      let user = await this.repository.create(data);

      user = await this.repository.save(user);

      this.logger.log('user created successfully');

      return user;
    } catch (err) {
      throw new CustomErrorException(err);
    }
  }
}
