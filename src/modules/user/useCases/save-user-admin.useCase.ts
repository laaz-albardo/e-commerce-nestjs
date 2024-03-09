import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserDto } from '../dto';
import { User } from '../schemas';
import { errorInstaceOf } from '@src/shared';
import { UserRoleEnum } from '../enums';

@Injectable()
export class SaveUserAdminUseCase {
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

      let user = await this.repository.create({
        ...data,
        role: UserRoleEnum.ADMIN,
      });

      user = await this.repository.save(user);

      this.logger.log('user created successfully');

      return user;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
