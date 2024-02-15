import { BaseMongoDbRepository } from 'src/shared';
import { User } from '../schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../types';
import { Model } from 'mongoose';
import { IUser } from '../interfaces';

@Injectable()
export class UserRepository extends BaseMongoDbRepository<UserDocument> {
  constructor(@InjectModel(User.name) repository: Model<UserDocument>) {
    super(User.name, repository);
  }

  async create(data: IUser): Promise<UserDocument> {
    return new this.repository(data);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find().exec();
  }
}
