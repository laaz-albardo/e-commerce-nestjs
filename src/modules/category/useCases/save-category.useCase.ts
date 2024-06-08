import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CategoryRepository } from '../repositories';
import { CreateCategoryDto } from '../dto';
import { Category } from '../schemas';
import { errorInstaceOf } from '@src/shared';
import { SaveFileUseCase } from '@src/modules/file/useCases';
import { IFile } from '@src/modules/file';

@Injectable()
export class SaveCategoryUseCase {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(
    private readonly repository: CategoryRepository,
    private readonly saveFileUseCase: SaveFileUseCase,
  ) {}

  async saveCategory(
    data: CreateCategoryDto,
    image: Express.Multer.File,
  ): Promise<Category> {
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

      const saveImage: IFile = await this.saveFileUseCase.saveFile(image);

      let category = await this.repository.create({
        ...data,
        file: saveImage,
      });

      category = await this.repository.save(category);

      this.logger.log('category created successfully');

      return category;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
