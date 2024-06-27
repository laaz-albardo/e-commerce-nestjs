import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from '../repositories';
import { UpdateProductDto } from '../dto';
import { Product } from '../schemas';
import { GetProductUseCase } from './get-product.useCase';
import { IFile, SaveArrayFilesUseCase } from '@src/modules/file';
import { isNotEmpty } from 'class-validator';
import { unlinkSync } from 'fs';
import { ProductDocument } from '../types';
import { CategoryDocument, GetCategoryUseCase } from '@src/modules/category';
import { errorInstaceOf } from '@src/shared';

@Injectable()
export class UpdateProductUseCase {
  private readonly logger = new Logger(ProductRepository.name);

  constructor(
    private readonly repository: ProductRepository,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly saveArrayFilesUseCase: SaveArrayFilesUseCase,
  ) {}

  async updateProduct(
    _id: string,
    data: UpdateProductDto,
    images?: Array<Express.Multer.File>,
  ): Promise<Product> {
    try {
      this.logger.log('update product...');

      let validateCategory: CategoryDocument;

      if (isNotEmpty(data.category)) {
        validateCategory = await this.getCategoryUseCase.getCategoryById(
          String(data.category),
        );
      }

      const validateProduct = await this.getProductUseCase.getProductById(_id);

      if (isNotEmpty(data.name)) {
        const validateProductName = await (
          await this.repository.findOne({
            name: data.name,
          })
        )?.populate('category');

        if (
          validateProductName &&
          validateProductName?.id !== validateProduct.id &&
          validateProductName?.category?.id === validateProduct.category.id
        ) {
          throw new ConflictException(
            `${validateProductName.name} product is already registered in this category`,
          );
        }
      }

      let updateImage: IFile[] = validateProduct?.files;

      if (images.length > 0) {
        updateImage = await this.saveArrayFilesUseCase.saveArrayFiles(images);

        if (validateProduct.files.length > 0) {
          for await (const file of validateProduct.files) {
            unlinkSync(file.route);
          }
        }
      }

      let updateProduct = await this.repository.update(_id, {
        ...data,
        category: validateCategory?.id ?? validateProduct.category,
        files: updateImage,
      } as ProductDocument);

      updateProduct = await this.getProductUseCase.getProductById(
        updateProduct.id,
      );

      this.logger.log('Product updated successfully');

      return updateProduct;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
