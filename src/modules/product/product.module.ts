import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas';
import { ProductRepository } from './repositories';
import { FileModule } from '../file';
import { SaveProductUseCase } from './useCases';
import { CategoryModule } from '../category';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    FileModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, SaveProductUseCase],
})
export class ProductModule {}
