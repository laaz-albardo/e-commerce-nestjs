import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories';
import { ProductDocument } from '../types';
import { errorInstaceOf } from '@src/shared';

@Injectable()
export class ListProductsUseCase {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(private readonly repository: ProductRepository) {}

  async listUsers(
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    orderByName?: number,
    orderByPrice?: number,
    orderByCreatedAt?: number,
    pagination?: boolean,
    page?: number,
    limit?: number,
  ): Promise<ProductDocument[]> {
    try {
      this.logger.log('list products...');

      const products = await this.repository.findAll(
        name,
        minPrice,
        maxPrice,
        category,
        orderByName,
        orderByPrice,
        orderByCreatedAt,
        pagination,
        page,
        limit,
      );

      this.logger.log('products listed successfully');

      return products;
    } catch (err) {
      console.log(err);
      throw errorInstaceOf(err);
    }
  }
}
