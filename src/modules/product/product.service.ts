import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { BaseResponse } from '@src/shared';
import {
  DeleteProductUseCase,
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
    private readonly deleteProductUseCase: DeleteProductUseCase,
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

  async findAll(
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    orderByName?: number,
    orderByPrice?: number,
    orderByCreatedAt?: number,
    pagination?: boolean,
    page?: number,
    limit?: number,
  ) {
    const data = await this.listProductsUseCase.listUsers(
      name,
      minPrice,
      maxPrice,
      category,
      orderByName,
      orderByPrice,
      orderByCreatedAt,
      pagination,
      page,
      limit,
    );

    return this.response.send(data, HttpStatus.OK, new ProductTransformer());
  }

  async findOneById(id: string) {
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
      HttpStatus.ACCEPTED,
      new ProductTransformer(),
    );
  }

  async remove(id: string) {
    const data = await this.deleteProductUseCase.deleteProduct(id);

    return this.response.send(
      data,
      HttpStatus.ACCEPTED,
      new ProductTransformer(),
    );
  }
}
