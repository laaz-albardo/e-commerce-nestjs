import { Transformer } from '@src/shared';
import { UserTransformer } from '@src/modules/user';
import { IToken } from '../interfaces';

export class AuthTransformer extends Transformer {
  private readonly userTransformer: UserTransformer;

  constructor() {
    super();
    this.userTransformer = new UserTransformer();
  }

  public async transform(token: IToken) {
    const user = await this.validate(token.getUser(), this.userTransformer);

    return {
      ...user,
      token: token.getHash(),
    };
  }
}
