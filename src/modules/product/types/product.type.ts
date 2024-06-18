import { HydratedDocument } from 'mongoose';
import { Product } from '../schemas';

export type ProductDocument = HydratedDocument<Product>;
