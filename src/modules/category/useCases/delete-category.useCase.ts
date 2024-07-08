import { Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { GetCategoryUseCase } from './get-category.useCase';
import { errorInstaceOf } from '@src/shared';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class DeleteCategoryUseCase {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(
    private readonly repository: CategoryRepository,
    private readonly getCategoryUseCase: GetCategoryUseCase,
  ) {}

  async deleteCategory(_id: string) {
    try {
      this.logger.log('delete category...');

      await this.getCategoryUseCase.getCategoryById(_id);

      const deleteCategory = await this.repository.delete(_id);

      if (deleteCategory.file && existsSync(deleteCategory.file.route)) {
        unlinkSync(deleteCategory.file.route);
      }

      this.logger.log('category deleted successfully');

      return deleteCategory;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
