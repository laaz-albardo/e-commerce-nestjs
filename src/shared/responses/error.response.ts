import { HttpException } from '@nestjs/common';

export class CustomErrorException extends HttpException {
  constructor(exception: HttpException, message?: any) {
    super(
      {
        statusCode: exception.getStatus(),
        data: null,
        msg: exception.name,
        errors: message || exception.message,
      },
      exception.getStatus(),
    );
  }
}
