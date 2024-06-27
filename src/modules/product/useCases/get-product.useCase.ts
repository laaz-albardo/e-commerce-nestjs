import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories';
import { ProductDocument } from '../types';
import { Types } from 'mongoose';
import { errorInstaceOf } from '@src/shared';

@Injectable()
export class GetProductUseCase {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(private readonly repository: ProductRepository) {}

  async getProductById(_id: string): Promise<ProductDocument> {
    try {
      this.logger.log('get product...');

      const validateObjectId = Types.ObjectId.isValid(_id);

      if (!validateObjectId) {
        throw new BadRequestException('Id invalid, Product not found');
      }

      const product = (await this.repository.findOneById(_id)).populate(
        'category',
      );

      this.logger.log('product successfully');

      return product;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
