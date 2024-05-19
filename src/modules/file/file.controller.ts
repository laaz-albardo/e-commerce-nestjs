import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileService } from './file.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { MulterMultiStorage } from '@src/config';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('multi')
  @UseInterceptors(MulterMultiStorage)
  async createFiles(@UploadedFiles() images: Array<Express.Multer.File>) {
    return this.fileService.createMultiFiles(images);
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
