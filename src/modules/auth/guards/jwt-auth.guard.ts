import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomErrorException, errorInstaceOf } from '@src/shared';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const token = request.cookies?.token;

    if (token) {
      return super.canActivate(context);
    } else {
      const err = new ForbiddenException('Permission denied');
      throw errorInstaceOf(err);
    }
  }

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
