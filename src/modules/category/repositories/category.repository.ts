import { Injectable } from '@nestjs/common';
import { BaseMongoDbRepository } from '@src/shared';
import { CategoryDocument } from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schemas';
import { Model } from 'mongoose';
import { ICategory } from '../interfaces';

@Injectable()
export class CategoryRepository extends BaseMongoDbRepository<CategoryDocument> {
  constructor(@InjectModel(Category.name) repository: Model<CategoryDocument>) {
    super(Category.name, repository);
  }

  async create(data: ICategory): Promise<CategoryDocument> {
    return new this.repository(data);
  }

  async findAll(): Promise<CategoryDocument[]> {
    return await this.repository.find().exec();
  }
}
