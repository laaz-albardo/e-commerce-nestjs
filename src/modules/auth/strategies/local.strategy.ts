import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '@src/modules/user';
import { AuthUserUseCase } from '../useCases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authUserUseCase: AuthUserUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      const user = await this.authUserUseCase.authUser(email, password);

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}
