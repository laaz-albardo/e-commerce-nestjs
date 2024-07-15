import { Injectable } from '@nestjs/common';
import { BaseMongoDbRepository } from '@src/shared';
import { CategoryDocument } from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schemas';
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose';
import { ICategory } from '../interfaces';

@Injectable()
export class CategoryRepository extends BaseMongoDbRepository<CategoryDocument> {
  constructor(
    @InjectModel(Category.name) repository: Model<CategoryDocument>,
    @InjectModel(Category.name)
    private readonly paginateRepository: PaginateModel<CategoryDocument>,
  ) {
    super(Category.name, repository);
  }

  async create(data: ICategory): Promise<CategoryDocument> {
    return new this.repository(data);
  }

  async findAll(
    pagination?: boolean,
    page?: number,
    limit?: number,
  ): Promise<CategoryDocument[] | any> {
    const filters: FilterQuery<CategoryDocument> = {};

    const pageFilter: PaginateOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
    };

    if (pagination) {
      return await this.paginateRepository.paginate(filters, pageFilter);
    }

    return await this.repository.find(filters).exec();
  }
}
