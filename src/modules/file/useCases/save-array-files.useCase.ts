import { Injectable, Logger } from '@nestjs/common';
import { errorInstaceOf } from '@src/shared';
import { FileRepository } from '../repositories';
import { File } from '../schemas';

@Injectable()
export class SaveArrayFilesUseCase {
  private readonly logger = new Logger(FileRepository.name);

  constructor(private readonly repository: FileRepository) {}

  async saveArrayFiles(data: Array<Express.Multer.File>): Promise<File[]> {
    try {
      this.logger.log('creating files...');

      const results = [];

      for await (const image of data) {
        const createFile = await this.repository.create();
        createFile.route = image.path;
        results.push(createFile);
      }

      this.logger.log('files created successfully');

      return results;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
