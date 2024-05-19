import { Injectable, Logger } from '@nestjs/common';
import { errorInstaceOf } from '@src/shared';
import { FileRepository } from '../repositories';

@Injectable()
export class SaveFilesUseCase {
  private readonly logger = new Logger(FileRepository.name);

  constructor(private readonly repository: FileRepository) {}

  async saveFiles(data: Array<Express.Multer.File>): Promise<File[]> {
    try {
      this.logger.log('creating files...');

      let createFile = null;
      const array = [];

      for await (const image of data) {
        createFile = this.repository.create();
        createFile.route = image.path;
        const save = await this.repository.save(createFile);
        array.push(save);
      }

      this.logger.log('files created successfully');

      return array;
    } catch (err) {
      console.log(err);
      throw errorInstaceOf(err);
    }
  }
}
