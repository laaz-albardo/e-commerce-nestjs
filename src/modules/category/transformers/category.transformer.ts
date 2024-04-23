import { Transformer } from '@src/shared';
import { ICategory } from '../interfaces';

export class CategoryTransformer extends Transformer {
  constructor() {
    super();
  }

  public async transform(category: ICategory): Promise<ICategory> {
    return {
      _id: category._id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
