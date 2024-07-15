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
    let paginateParams: object = null;

    if (data['docs']) {
      const parameters: any = { ...data };
      delete parameters.docs;
      paginateParams = parameters;
    }

    data = await transformers.handle(data);

    let statusMessage: string | number = Object.values(this.dataModel).indexOf(
      status,
    );

    statusMessage = Object.keys(this.dataModel)[statusMessage];

    return {
      statusCode: status,
      data,
      paginateParams,
      msg: `${statusMessage}`,
      errors: null,
    };
  }
}
