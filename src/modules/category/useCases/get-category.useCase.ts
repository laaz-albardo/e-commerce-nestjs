import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { Types } from 'mongoose';
import { errorInstaceOf } from '@src/shared';
import { CategoryDocument } from '../types';

@Injectable()
export class GetCategoryUseCase {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(private readonly repository: CategoryRepository) {}

  async getCategoryById(_id: string): Promise<CategoryDocument> {
    try {
      this.logger.log('get category...');

      const validateObjectId = Types.ObjectId.isValid(_id);

      if (!validateObjectId) {
        throw new BadRequestException('Id invalid, category not found');
      }

      const category = await this.repository.findOneById(_id);

      this.logger.log('category successfully');

      return category;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
