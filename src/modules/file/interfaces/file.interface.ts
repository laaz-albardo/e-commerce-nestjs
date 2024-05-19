import { IBase } from '@src/shared';

export interface IFile extends Partial<IBase> {
  route: string;
  fullPath?: string;
}
