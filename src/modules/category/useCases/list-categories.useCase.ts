import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { errorInstaceOf } from '@src/shared';
import { CategoryDocument } from '../types';

@Injectable()
export class ListCategoriesUseCase {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(private readonly repository: CategoryRepository) {}

  async listUsers(): Promise<CategoryDocument[]> {
    try {
      this.logger.log('list categories...');

      const categories = await this.repository.findAll();

      this.logger.log('categories listed successfully');

      return categories;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
