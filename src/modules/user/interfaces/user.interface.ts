import { IBase } from '@src/shared';
import { IPerson } from './person.interface';

export interface IUser extends Partial<IBase> {
  email: string;
  password: string;
  person: IPerson;
}
