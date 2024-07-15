import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { errorInstaceOf } from '@src/shared';
import { CategoryDocument } from '../types';

@Injectable()
export class GetCategoryUseCase {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(private readonly repository: CategoryRepository) {}

  async getCategoryById(_id: string): Promise<CategoryDocument> {
    try {
      this.logger.log('get category...');

      const category = await this.repository.findOneById(_id);

      this.logger.log('category successfully');

      return category;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
