import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { GetCategoryUseCase } from './get-category.useCase';
import { UpdateCategoryDto } from '../dto';
import { CategoryDocument } from '../types';
import { Category } from '../schemas';
import { errorInstaceOf } from '@src/shared';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class UpdateCategoryUseCase {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(
    private readonly repository: CategoryRepository,
    private readonly getCategoryUseCase: GetCategoryUseCase,
  ) {}

  async updateCategory(
    _id: string,
    data: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      this.logger.log('update category...');

      const validateCategory =
        await this.getCategoryUseCase.getCategoryById(_id);

      if (isNotEmpty(data.name)) {
        const validateCategoryName = await this.repository.findOne({
          name: data.name,
        });

        if (
          validateCategoryName &&
          validateCategoryName.id !== validateCategory.id
        ) {
          throw new ConflictException(
            `${validateCategoryName.name} category is already registered`,
          );
        }
      }

      const updateCategory = await this.repository.update(
        _id,
        data as CategoryDocument,
      );

      this.logger.log('category updated successfully');

      return updateCategory;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
