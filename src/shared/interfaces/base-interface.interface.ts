import { ObjectId } from 'mongoose';

export interface IBase {
  _id: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  id?: string | null;
}
