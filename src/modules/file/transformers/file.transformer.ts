import { Transformer } from '@src/shared';
import { IFile } from '../interfaces';
import 'dotenv/config';

export class FileTransformer extends Transformer {
  constructor() {
    super();
  }

  public async transform(file: IFile): Promise<IFile> {
    const fullPath = `${process.env.SERVER_HOST}/${file.route}`;

    return {
      _id: file._id,
      route: file.route,
      fullPath,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
