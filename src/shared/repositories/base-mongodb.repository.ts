import { Injectable, NotFoundException } from '@nestjs/common';
import { IBaseMongoDbRepository } from '../interfaces';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export abstract class BaseMongoDbRepository<T>
  implements IBaseMongoDbRepository<T>
{
  protected constructor(
    protected readonly entityName: string,
    protected readonly repository: Model<T>,
  ) {}

  async save(data: T): Promise<T> {
    return await this.repository.create(data);
  }

  async findOneById(_id: string): Promise<T> {
    const entity = await this.repository.findById(_id).exec();

    if (!entity) {
      throw new NotFoundException(`${this.entityName} not found`);
    }

    return entity;
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    return await this.repository.findOne(filter).exec();
  }

  async update(_id: string, data: T): Promise<T> {
    return await this.repository
      .findOneAndUpdate({ where: { _id } }, data, {
        new: true,
      })
      .exec();
  }

  async delete(_id: string): Promise<T> {
    return await this.repository.findOneAndDelete({ where: { _id } }).exec();
  }
}
