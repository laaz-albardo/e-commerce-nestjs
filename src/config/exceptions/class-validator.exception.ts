import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { errorInstaceOf } from '@src/shared';

export const ClassValidatorConfig = new ValidationPipe({
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  validationError: {
    target: false,
  },
  exceptionFactory: ClassValidatorExceptions,
});

export function ClassValidatorExceptions(errors: ValidationError[]) {
  const e = errors.map((error) => {
    const tmp = {};
    tmp[error.property] = [];
    let keys = null;
    if (error.children.length > 0) {
      error.children.forEach((children) => {
        const childErrors = {};
        childErrors[children.property] = [];
        keys = Object.keys(children.constraints);
        keys.forEach((key) => {
          childErrors[children.property].push(children.constraints[key]);
        });
        tmp[error.property].push(childErrors);
      });
    } else {
      keys = Object.keys(error.constraints);
      keys.forEach((key) => {
        tmp[error.property].push(error.constraints[key]);
      });
    }
    return tmp;
  });
  const err = new UnprocessableEntityException(e);
  const errMessage: any = err.getResponse();
  return errorInstaceOf(err, errMessage.message);
}
