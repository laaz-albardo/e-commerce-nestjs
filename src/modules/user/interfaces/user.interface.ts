import { IBase } from '@src/shared';
import { IPerson } from './person.interface';
import { UserRoleEnum } from '../enums';

export interface IUser extends Partial<IBase> {
  email: string;
  password: string;
  role: UserRoleEnum;
  person: IPerson;
}
