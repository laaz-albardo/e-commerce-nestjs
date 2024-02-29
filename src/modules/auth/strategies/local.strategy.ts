import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '@src/modules/user';
import { AuthUserUseCase } from '../useCases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authUserUseCase: AuthUserUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      this.logger.log('validate user...');

      const user = await this.authUserUseCase.authUser(email, password);

      if (!user) {
        throw new UnauthorizedException();
      }

      this.logger.log('validate successfully');

      return user;
    } catch (err) {
      throw err;
    }
  }
}
