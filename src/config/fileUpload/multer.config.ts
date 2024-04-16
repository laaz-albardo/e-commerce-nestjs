import { diskStorage, memoryStorage, Options, StorageEngine } from 'multer';
import {
  FileFastifyInterceptor,
  FilesFastifyInterceptor,
} from 'fastify-file-interceptor';
import { BadRequestException, Logger } from '@nestjs/common';
import { extname, join } from 'path';
import { v4 as uuidV4 } from 'uuid';
import { errorInstaceOf } from '@src/shared';
import 'dotenv/config';

const logger = new Logger('MulterConfig');

const saveStorage = (): StorageEngine => {
  if (String(process.env.CLOUDINARY) === 'true') {
    logger.log('Using Cloudinary Config');
    return memoryStorage();
  } else {
    logger.log('Using Local Config');
    return diskStorage({
      destination: join(__dirname, '../../../', 'public/upload/images'),
      filename: function (req, file, cb) {
        const uniqueNameFile =
          uuidV4() + extname(file.originalname).toLocaleLowerCase();
        cb(null, uniqueNameFile);
      },
    });
  }
};

export const MulterConfig: Options = {
  storage: saveStorage(),

  limits: {
    fileSize: 5000000, // 5mb to bytes
    files: 5, // limit
  },

  fileFilter: function (req, file, cb) {
    try {
      const fileType = /jpg|jpeg|png|gif/;

      const mimetype = fileType.test(file.mimetype);

      const extpath = fileType.test(extname(file.originalname));

      if (mimetype && extpath) {
        return cb(null, true);
      } else {
        const err = new BadRequestException(
          'The file must be an image jpg, jpeg, png, gif',
        );
        throw errorInstaceOf(err);
      }
    } catch (err) {
      cb(err);
    }
  },
};

export const MulterMultiStorage = FilesFastifyInterceptor('files', 6);

export const MulterStorage = FileFastifyInterceptor('file');
