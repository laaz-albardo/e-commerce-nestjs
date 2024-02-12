import { IPerson } from './person.interface';

export interface IUser {
  email: string;
  password: string;
  person: IPerson;
}
