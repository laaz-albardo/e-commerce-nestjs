import { FilterQuery } from 'mongoose';

export interface IBaseMongoDbRepository<T> {
  save(entity: T): Promise<T>;
  findOneById(_id: string): Promise<T>;
  findOne(filter: FilterQuery<T>): Promise<T>;
  update(_id: string, data: T): Promise<T>;
  delete(_id: string): Promise<T>;
}
