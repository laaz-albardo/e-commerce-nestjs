import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAuhtInterceptorResponse } from '../interfaces';
import { FastifyReply } from 'fastify';

@Injectable()
export class LogoutInterceptor<T>
  implements
    NestInterceptor<T, Promise<IAuhtInterceptorResponse<FastifyReply>>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<IAuhtInterceptorResponse<FastifyReply>>> {
    const res = context.switchToHttp().getResponse<FastifyReply>();

    const expires = new Date(Date.now());

    return next.handle().pipe(
      map(
        async () => (
          res.clearCookie('token', { expires }),
          {
            statusCode: res.statusCode,
            msg: 'Session end',
            data: null as any,
            errors: null,
          }
        ),
      ),
    );
  }
}
