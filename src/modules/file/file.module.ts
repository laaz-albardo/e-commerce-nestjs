import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas';
import { FastifyMulterModule } from 'fastify-file-interceptor';
import { Options } from 'multer';
import { MulterConfig } from '@config/fileUpload';
import { FileRepository } from './repositories';
import { SaveArrayFilesUseCase, SaveFileUseCase } from './useCases';

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
  providers: [FileRepository, SaveArrayFilesUseCase, SaveFileUseCase],
})
export class FileModule {}
