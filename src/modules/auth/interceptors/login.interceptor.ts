import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAuhtInterceptorResponse } from '../interfaces';
import { AuthTransformer } from '../transformers';
import { FastifyReply } from 'fastify';

@Injectable()
export class LoginInterceptor<T>
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
        msg: 'Session started',
        data: await new AuthTransformer().handle(data),
        errors: null,
      })),
    );
  }
}
