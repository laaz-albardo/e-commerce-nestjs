import { Injectable, Logger } from '@nestjs/common';
import { errorInstaceOf } from '@src/shared';
import { FileRepository } from '../repositories';
import { File } from '../schemas';

@Injectable()
export class SaveFileUseCase {
  private readonly logger = new Logger(FileRepository.name);

  constructor(private readonly repository: FileRepository) {}

  async saveFile(data: Express.Multer.File): Promise<File> {
    try {
      this.logger.log('creating file...');

      const createFile = await this.repository.create();
      createFile.route = data.path;

      this.logger.log('file created successfully');

      return createFile;
    } catch (err) {
      throw errorInstaceOf(err);
    }
  }
}
