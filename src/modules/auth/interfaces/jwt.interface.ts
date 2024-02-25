import { UserRoleEnum } from '@src/modules/user';
import { ObjectId } from 'mongoose';

export interface IJWTPayload {
  _id: ObjectId | string;
  email: string;
  role: UserRoleEnum;
  createdAt: Date;
}
