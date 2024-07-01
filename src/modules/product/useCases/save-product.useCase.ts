import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories';
import { IFile, SaveArrayFilesUseCase } from '@src/modules/file';
import { Product } from '../schemas';
import { CreateProductDto } from '../dto';
import { errorInstaceOf } from '@src/shared';
import { GetCategoryUseCase } from '@src/modules/category';

@Injectable()
export class SaveProductUseCase {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(
    private readonly repository: ProductRepository,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly saveFileUseCase: SaveArrayFilesUseCase,
  ) {}

  async saveProduct(
    data: CreateProductDto,
    images?: Array<Express.Multer.File>,
  ): Promise<Product> {
    try {
      this.logger.log('creating product...');

      const validateCategory = await this.getCategoryUseCase.getCategoryById(
        String(data.category),
      );

      const validateProductName = await this.repository.findOne({
        name: data.name,
        category: data.category,
      });

      if (validateProductName) {
        throw new ConflictException(
          `${validateProductName.name} product is already registered in this category`,
        );
      }

      let saveImage: IFile[] | null;

      if (images) {
        saveImage = await this.saveFileUseCase.saveArrayFiles(images);
      }

      let product = await this.repository.create({
        ...data,
        category: validateCategory.id,
        files: saveImage,
      });

      product = await (
        await this.repository.save(product)
      ).populate('category');

      this.logger.log('product created successfully');

      return product;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
