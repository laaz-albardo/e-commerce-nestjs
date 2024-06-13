import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { BaseResponse } from '@src/shared';
import { SaveProductUseCase } from './useCases';
import { ProductTransformer } from './transformers';

@Injectable()
export class ProductService {
  private readonly response: BaseResponse = new BaseResponse();

  constructor(private readonly saveProductUseCase: SaveProductUseCase) {}

  async create(
    createProductDto: CreateProductDto,
    images?: Array<Express.Multer.File>,
  ) {
    const data = await this.saveProductUseCase.saveProduct(
      createProductDto,
      images,
    );

    return this.response.send(
      data,
      HttpStatus.CREATED,
      new ProductTransformer(),
    );
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
