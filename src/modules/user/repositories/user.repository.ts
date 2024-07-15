import { BaseMongoDbRepository } from '@src/shared';
import { User } from '../schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../types';
import { FilterQuery, Model, PaginateModel, PaginateOptions } from 'mongoose';
import { IUser } from '../interfaces';
import { UserRoleEnum } from '../enums';

@Injectable()
export class UserRepository extends BaseMongoDbRepository<UserDocument> {
  constructor(
    @InjectModel(User.name) repository: Model<UserDocument>,
    @InjectModel(User.name)
    private readonly paginateRepository: PaginateModel<UserDocument>,
  ) {
    super(User.name, repository);
  }

  async create(data: IUser): Promise<UserDocument> {
    return new this.repository(data);
  }

  async saveMany(data: IUser[]): Promise<UserDocument[]> {
    return await this.repository.insertMany(data);
  }

  async findAll(
    pagination?: boolean,
    page?: number,
    limit?: number,
  ): Promise<User[] | any> {
    const filters: FilterQuery<UserDocument> = {
      role: { $ne: UserRoleEnum.SUPER_ADMIN },
    };

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
