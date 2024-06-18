import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories';
import { ProductDocument } from '../types';
import { errorInstaceOf } from '@src/shared';

@Injectable()
export class ListProductsUseCase {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(private readonly repository: ProductRepository) {}

  async listUsers(): Promise<ProductDocument[]> {
    try {
      this.logger.log('list products...');

      const products = await this.repository.findAll();

      this.logger.log('products listed successfully');

      return products;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
