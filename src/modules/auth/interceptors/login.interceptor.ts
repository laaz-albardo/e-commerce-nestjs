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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoginInterceptor<T>
  implements
    NestInterceptor<T, Promise<IAuhtInterceptorResponse<FastifyReply>>>
{
  constructor(private readonly config: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<IAuhtInterceptorResponse<FastifyReply>>> {
    const res = context.switchToHttp().getResponse<FastifyReply>();

    const expires = new Date(
      Date.now() + Number(this.config.getOrThrow('JWT_EXPIRES') * 1000),
    );

    return next.handle().pipe(
      map(
        async (data) => (
          res.setCookie('token', data.hash, {
            expires,
          }),
          {
            statusCode: res.statusCode,
            msg: 'Session started',
            data: await new AuthTransformer().handle(data),
            errors: null,
          }
        ),
      ),
    );
  }
}
