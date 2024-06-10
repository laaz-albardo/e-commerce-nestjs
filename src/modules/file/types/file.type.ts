import { HydratedDocument } from 'mongoose';
import { File } from '../schemas';

export type FileDocument = HydratedDocument<File>;
