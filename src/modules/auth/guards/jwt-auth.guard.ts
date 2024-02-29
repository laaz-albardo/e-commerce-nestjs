import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomErrorException } from '@src/shared';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      if (!(err instanceof CustomErrorException)) {
        const error = err || new UnauthorizedException('Permission denied');

        throw new CustomErrorException(error);
      } else {
        throw err;
      }
    }

    return user;
  }
}
