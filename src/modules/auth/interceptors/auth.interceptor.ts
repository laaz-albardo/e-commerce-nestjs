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

@Injectable()
export class AuthInterceptor<T>
  implements NestInterceptor<T, Promise<IAuhtInterceptorResponse<any>>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<IAuhtInterceptorResponse<any>>> {
    const res = context.switchToHttp().getResponse();
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
