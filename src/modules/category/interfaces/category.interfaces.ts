import { IFile } from '@src/modules/file';
import { IBase } from '@src/shared';

export interface ICategory extends Partial<IBase> {
  name: string;
  file: IFile;
}
