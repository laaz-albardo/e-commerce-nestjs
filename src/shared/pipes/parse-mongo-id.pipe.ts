import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { isMongoId } from 'class-validator';
import { errorInstaceOf } from '../helpers';

export interface ParseMongoIdPipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  exceptionFactory?: (error: string) => any;
  optional?: boolean;
}

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  constructor(private readonly options?: ParseMongoIdPipeOptions) {}

  transform(value: string) {
    if (this.options?.optional && !value) {
      return value;
    }

    try {
      const validateObjectId = isMongoId(value);

      if (!validateObjectId) {
        throw new BadRequestException('Id invalid');
      }

      return value;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
