import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories';
import { GetProductUseCase } from './get-product.useCase';
import { errorInstaceOf } from '@src/shared';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class DeleteProductUseCase {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(
    private readonly repository: ProductRepository,
    private readonly getProductUseCase: GetProductUseCase,
  ) {}

  async deleteProduct(_id: string) {
    try {
      this.logger.log('delete product...');

      const product = await this.getProductUseCase.getProductById(_id);

      const deleteProduct = await this.repository.delete(product.id);

      if (deleteProduct.files.length > 0) {
        for await (const file of deleteProduct.files) {
          if (existsSync(file.route)) {
            unlinkSync(file.route);
          }
        }
      }

      this.logger.log('product deleted successfully');

      return product;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
