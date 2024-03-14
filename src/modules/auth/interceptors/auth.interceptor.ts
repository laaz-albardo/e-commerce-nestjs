import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserTransformer } from '@src/modules/user';
import { IAuhtInterceptorResponse } from '../interfaces';
import { FastifyReply } from 'fastify';

@Injectable()
export class AuthInterceptor<T>
  implements
    NestInterceptor<T, Promise<IAuhtInterceptorResponse<FastifyReply>>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<IAuhtInterceptorResponse<FastifyReply>>> {
    const res = context.switchToHttp().getResponse<FastifyReply>();
    return next.handle().pipe(
      map(async (data) => ({
        statusCode: res.statusCode,
        msg: 'Authenticated',
        data: await new UserTransformer().handle(data),
        errors: null,
      })),
    );
  }
}
