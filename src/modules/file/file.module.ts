import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas';
import { FastifyMulterModule } from 'fastify-file-interceptor';
import { CloudinaryProvider, MulterConfig } from '@config/fileUpload';
import { Options } from 'multer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    FastifyMulterModule.registerAsync({
      useFactory: (): Options => {
        return {
          ...MulterConfig,
        };
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService, CloudinaryProvider],
})
export class FileModule {}
