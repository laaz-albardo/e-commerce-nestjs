import { Injectable } from '@nestjs/common';
import { BaseMongoDbRepository } from '@src/shared';
import { InjectModel } from '@nestjs/mongoose';
import { FileDocument } from '../types/file.type';
import { Model } from 'mongoose';
import { File } from '../schemas';
import { IFile } from '../interfaces';

@Injectable()
export class FileRepository extends BaseMongoDbRepository<FileDocument> {
  constructor(@InjectModel(File.name) repository: Model<FileDocument>) {
    super(File.name, repository);
  }

  async create(data?: IFile): Promise<FileDocument> {
    return new this.repository(data);
  }
}
