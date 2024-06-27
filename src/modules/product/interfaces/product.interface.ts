import { ICategory } from '@src/modules/category';
import { IFile } from '@src/modules/file';
import { IBase } from '@src/shared';

export interface IProduct extends Partial<IBase> {
  name: string;
  description: string;
  stock: number;
  price: number;
  enable: boolean;
  category: ICategory;
  files?: IFile[] | null;
}
