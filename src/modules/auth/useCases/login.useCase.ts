import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTToken } from '../jwt';

@Injectable()
export class LoginUseCase {
  constructor(private readonly jwtService: JwtService) {}

  loginUser(user: any) {
    try {
      return new JWTToken(this.jwtService, user._doc);
    } catch (error) {
      throw error;
    }
  }
}
