import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTToken } from '../jwt';
import { CustomErrorException } from '@src/shared';

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  loginUser(user: any) {
    try {
      return new JWTToken(this.jwtService, user._doc);
    } catch (err) {
      throw new CustomErrorException(err);
    }
  }
}
