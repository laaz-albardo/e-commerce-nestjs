import { HydratedDocument } from 'mongoose';
import { Category } from '../schemas';

export type CategoryDocument = HydratedDocument<Category>;
