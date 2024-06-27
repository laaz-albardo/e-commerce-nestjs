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

  async findAll(
    name?: string,
    minPrice?: number,
    maxPrice?: number,
    category?: string,
    orderByName?: number,
    orderByPrice?: number,
    orderByCreatedAt?: number,
  ): Promise<ProductDocument[]> {
    const query = this.repository;

    const filter = {};

    const sortFilter = {};

    if (name) {
      filter['name'] = { $regex: '.*' + name + '.*' };
    }

    if (minPrice || maxPrice) {
      filter['price'] = {};

      if (minPrice) {
        filter['price']['$gte'] = minPrice;
      }

      if (maxPrice) {
        filter['price']['$lte'] = maxPrice;
      }
    }

    if (category) {
      filter['category'] = { $in: category };
    }

    if (orderByName) {
      sortFilter['name'] = orderByName;
    }

    if (orderByPrice) {
      sortFilter['price'] = orderByPrice;
    }

    sortFilter['createdAt'] = orderByCreatedAt ?? -1;

    return await query
      .find(filter)
      .sort(sortFilter)
      .populate('category')
      .exec();
  }
}
