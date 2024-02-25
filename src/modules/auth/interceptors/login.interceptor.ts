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

@Injectable()
export class LoginInterceptor<T>
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
        msg: 'Session started',
        data: await new AuthTransformer().handle(data),
        errors: null,
      })),
    );
  }
}
