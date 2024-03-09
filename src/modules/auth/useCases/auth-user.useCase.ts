import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { User, UserRepository } from '@src/modules/user';
import { errorInstaceOf } from '@src/shared';

@Injectable()
export class AuthUserUseCase {
  private readonly logger = new Logger(AuthUserUseCase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async authUser(email: string, pass: string): Promise<User> {
    try {
      this.logger.log('auth user...');

      const user = await this.userRepository.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        throw new NotFoundException('Unregistered Email');
      }

      if (await compare(pass, user.password)) {
        const { ...result } = user;

        this.logger.log('auth successfully');

        return result;
      } else {
        throw new UnauthorizedException('Incorrect password');
      }
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
