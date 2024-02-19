import { JwtService } from '@nestjs/jwt';
import { IJWTPayload, IToken } from '../interfaces';
import { IUser } from '@src/modules/user';

export class JWTToken implements IToken {
  private readonly hash: string;
  private readonly user: IUser;
  private readonly payload: IJWTPayload;

  constructor(
    private readonly jwtService: JwtService,
    user: IUser,
  ) {
    this.user = user;
    this.payload = {
      _id: user._id,
      email: user.email,
      createdAt: user.createdAt,
    };

    this.hash = this.jwtService.sign(this.payload);
  }

  getHash(): string {
    return this.hash;
  }

  getPayload(): IJWTPayload {
    return this.payload;
  }

  getUser(): IUser {
    return this.user;
  }
}
