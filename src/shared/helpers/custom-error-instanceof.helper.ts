import { HttpException } from '@nestjs/common';
import { CustomErrorException } from '../responses';

export function errorInstaceOf(
  exception: HttpException,
  message?: any,
): HttpException {
  if (!(exception instanceof CustomErrorException)) {
    throw new CustomErrorException(exception, message);
  } else {
    throw exception;
  }
}
