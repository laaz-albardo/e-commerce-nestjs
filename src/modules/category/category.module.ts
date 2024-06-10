import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schemas';
import { CategoryRepository } from './repositories';
import {
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  SaveCategoryUseCase,
  UpdateCategoryUseCase,
} from './useCases';
import { FileModule } from '../file';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    FileModule,
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    SaveCategoryUseCase,
    ListCategoriesUseCase,
    GetCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
})
export class CategoryModule {}
