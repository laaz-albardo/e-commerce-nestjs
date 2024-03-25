import { HydratedDocument } from 'mongoose';
import { User } from '../schemas';

export type UserDocument = HydratedDocument<User>;
