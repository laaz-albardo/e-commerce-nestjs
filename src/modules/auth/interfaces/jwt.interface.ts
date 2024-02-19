import { ObjectId } from 'mongoose';

export interface IJWTPayload {
  _id: ObjectId | string;
  email: string;
  createdAt: Date;
}
