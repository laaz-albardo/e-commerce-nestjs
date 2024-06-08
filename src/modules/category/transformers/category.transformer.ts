import { Transformer } from '@src/shared';
import { ICategory } from '../interfaces';
import { FileTransformer } from '@src/modules/file';

export class CategoryTransformer extends Transformer {
  private readonly fileTransformer: FileTransformer;

  constructor() {
    super();
    this.fileTransformer = new FileTransformer();
  }

  public async transform(category: ICategory): Promise<ICategory> {
    return {
      _id: category._id,
      name: category.name,
      file: await this.validate(category.file, this.fileTransformer),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
