import { Injectable } from '@nestjs/common';
import { BaseMongoDbRepository } from '@src/shared';
import { CategoryDocument } from '../types';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class CategoryRepository extends BaseMongoDbRepository<CategoryDocument> {
  constructor(@InjectModel(Category.name) repository: Model<CategoryDocument>) {
    super(Category.name, repository);
  }
}
