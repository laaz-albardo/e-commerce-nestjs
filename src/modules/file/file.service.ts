import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { BaseResponse } from '@src/shared';
import { SaveFilesUseCase } from './useCases/save-files.useCase';
import { FileTransformer } from './transformers';

@Injectable()
export class FileService {
  private readonly response: BaseResponse = new BaseResponse();

  constructor(private readonly saveFilesUseCase: SaveFilesUseCase) {}

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  async createMultiFiles(images: Array<Express.Multer.File>) {
    const data = await this.saveFilesUseCase.saveFiles(images);

    return this.response.send(data, HttpStatus.CREATED, new FileTransformer());
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
