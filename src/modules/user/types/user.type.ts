import { Document } from 'mongoose';
import { User } from '../schemas';

export type UserDocument = User & Document;
