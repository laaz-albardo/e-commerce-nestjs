import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthTransformer } from './auth.transformer';
import { UserTransformer } from '@src/modules/user';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class LoginInterceptor<T>
  implements NestInterceptor<T, Promise<Response<any>>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<Response<any>>> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map(async (data) => ({
        statusCode: res.statusCode,
        data: await new AuthTransformer().handle(data),
      })),
    );
  }
}

@Injectable()
export class AuthInterceptor<T>
  implements NestInterceptor<T, Promise<Response<any>>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<Response<any>>> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map(async (data) => ({
        statusCode: res.statusCode,
        data: await new UserTransformer().handle(data),
      })),
    );
  }
}
