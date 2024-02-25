import { HttpStatus } from '@nestjs/common';
import { IBaseResponse } from '../interfaces';
import { Transformer } from '../transformers';

export class BaseResponse {
  private readonly dataModel = HttpStatus;

  async send(
    data: object,
    status: HttpStatus,
    transformers: Transformer = null,
  ): Promise<IBaseResponse> {
    data = await transformers.handle(data);

    let statusMessage: string | number = Object.values(this.dataModel).indexOf(
      status,
    );

    statusMessage = Object.keys(this.dataModel)[statusMessage];

    return {
      statusCode: status,
      data,
      msg: `${statusMessage}`,
      errors: null,
    };
  }
}
