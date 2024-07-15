import { Injectable } from '@nestjs/common';
import { BaseMongoDbRepository } from '@src/shared';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from '../types';
import { Product } from '../schemas';
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose';
import { IProduct } from '../interfaces';

@Injectable()
export class ProductRepository extends BaseMongoDbRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name) repository: Model<ProductDocument>,
    @InjectModel(Product.name)
    private readonly paginateRepository: PaginateModel<ProductDocument>,
  ) {
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
    pagination?: boolean,
    page?: number,
    limit?: number,
  ): Promise<ProductDocument[] | any> {
    const filter: FilterQuery<ProductDocument> = {};

    const sortFilter = {};

    const pageFilter: PaginateOptions = {
      page: page ?? 1,
      limit: limit ?? 10,
      populate: 'category',
    };

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

    if (pagination) {
      return await this.paginateRepository.paginate(filter, pageFilter);
    }

    return await this.repository
      .find(filter)
      .sort(sortFilter)
      .populate('category')
      .exec();
  }
}
