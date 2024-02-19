import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { User, UserRepository } from '@src/modules/user';

@Injectable()
export class AuthUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async authUser(email: string, pass: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        email: email.toLowerCase(),
      });

      if (user && (await compare(pass, user.password))) {
        const { ...result } = user;

        return result;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }
}
