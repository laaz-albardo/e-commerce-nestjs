import { Injectable } from '@nestjs/common';
import { BaseMongoDbRepository } from '@src/shared';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from '../types';
import { Product } from '../schemas';
import { Model } from 'mongoose';
import { IProduct } from '../interfaces';

@Injectable()
export class ProductRepository extends BaseMongoDbRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) repository: Model<ProductDocument>) {
    super(Product.name, repository);
  }

  async create(data: IProduct): Promise<ProductDocument> {
    return new this.repository(data);
  }

  async findAll(): Promise<ProductDocument[]> {
    return await this.repository.find().exec();
  }
}
