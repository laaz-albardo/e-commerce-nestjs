import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  GetCategoryUseCase,
  ListCategoriesUseCase,
  SaveCategoryUseCase,
  UpdateCategoryUseCase,
} from './useCases';
import { BaseResponse } from '@src/shared';
import { CategoryTransformer } from './transformers';

@Injectable()
export class CategoryService {
  private readonly response: BaseResponse = new BaseResponse();

  constructor(
    private readonly saveCategoryUseCase: SaveCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly getCategoryUseCase: GetCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = await this.saveCategoryUseCase.saveCategory(createCategoryDto);

    return this.response.send(
      data,
      HttpStatus.CREATED,
      new CategoryTransformer(),
    );
  }

  async findAll() {
    const data = await this.listCategoriesUseCase.listUsers();

    return this.response.send(data, HttpStatus.OK, new CategoryTransformer());
  }

  async findOne(id: string) {
    const data = await this.getCategoryUseCase.getCategoryById(id);

    return this.response.send(data, HttpStatus.OK, new CategoryTransformer());
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const data = await this.updateCategoryUseCase.updateCategory(
      id,
      updateCategoryDto,
    );

    return this.response.send(
      data,
      HttpStatus.ACCEPTED,
      new CategoryTransformer(),
    );
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
