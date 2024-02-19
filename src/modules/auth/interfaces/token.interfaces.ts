import { IUser } from '@src/modules/user';
import { IJWTPayload } from './jwt.interface';

export interface IToken {
  getHash(): string;
  getPayload(): IJWTPayload;
  getUser(): IUser;
}
