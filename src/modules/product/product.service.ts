import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { BaseResponse } from '@src/shared';
import {
  GetProductUseCase,
  ListProductsUseCase,
  SaveProductUseCase,
  UpdateProductUseCase,
} from './useCases';
import { ProductTransformer } from './transformers';

@Injectable()
export class ProductService {
  private readonly response: BaseResponse = new BaseResponse();

  constructor(
    private readonly saveProductUseCase: SaveProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

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

  async findAll() {
    const data = await this.listProductsUseCase.listUsers();

    return this.response.send(data, HttpStatus.OK, new ProductTransformer());
  }

  async findOne(id: string) {
    const data = await this.getProductUseCase.getProductById(id);

    return this.response.send(data, HttpStatus.OK, new ProductTransformer());
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    images?: Array<Express.Multer.File>,
  ) {
    const data = await this.updateProductUseCase.updateProduct(
      id,
      updateProductDto,
      images,
    );

    return this.response.send(
      data,
      HttpStatus.CREATED,
      new ProductTransformer(),
    );
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
