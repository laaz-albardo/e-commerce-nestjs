import { Transformer } from '@src/shared';
import { IProduct } from '../interfaces';
import { CategoryTransformer } from '@src/modules/category';
import { FileTransformer } from '@src/modules/file';

export class ProductTransformer extends Transformer {
  private readonly categoryTransformer: CategoryTransformer;
  private readonly fileTransformer: FileTransformer;

  constructor() {
    super();
    this.categoryTransformer = new CategoryTransformer();
    this.fileTransformer = new FileTransformer();
  }

  public async transform(product: IProduct): Promise<IProduct> {
    return {
      _id: product._id,
      name: product.name,
      description: product.description,
      stock: product.stock,
      price: product.price,
      enable: product.enable,
      category: await this.validate(product.category, this.categoryTransformer),
      files: await this.validate(product?.files, this.fileTransformer),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
