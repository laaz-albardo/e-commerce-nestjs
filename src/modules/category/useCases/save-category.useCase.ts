import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { CreateCategoryDto } from '../dto';
import { Category } from '../schemas';
import { errorInstaceOf } from '@src/shared';

@Injectable()
export class SaveCategoryUseCase {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(private readonly repository: CategoryRepository) {}

  async saveCategory(data: CreateCategoryDto): Promise<Category> {
    try {
      this.logger.log('creating category...');

      const validateCategoryName = await this.repository.findOne({
        name: data.name,
      });

      if (validateCategoryName) {
        throw new ConflictException(
          `${validateCategoryName.name} category is already registered`,
        );
      }

      let category = await this.repository.create(data);

      category = await this.repository.save(category);

      this.logger.log('category created successfully');

      return category;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
