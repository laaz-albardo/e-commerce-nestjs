import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SaveCategoryUseCase } from './useCases';
import { BaseResponse } from '@src/shared';
import { CategoryTransformer } from './transformers';

@Injectable()
export class CategoryService {
  private readonly response: BaseResponse = new BaseResponse();

  constructor(private readonly saveCategoryUseCase: SaveCategoryUseCase) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const data = await this.saveCategoryUseCase.saveCategory(createCategoryDto);

    return this.response.send(
      data,
      HttpStatus.CREATED,
      new CategoryTransformer(),
    );
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
