import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas';
import { ProductRepository } from './repositories';
import { FileModule } from '../file';
import { CategoryModule } from '../category';
import {
  DeleteProductUseCase,
  GetProductUseCase,
  ListProductsUseCase,
  SaveProductUseCase,
  UpdateProductUseCase,
} from './useCases';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    FileModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    SaveProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
  ],
})
export class ProductModule {}
