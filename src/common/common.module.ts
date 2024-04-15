import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { v4 as uuid } from 'uuid';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/image-path.const';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 1000000,
      },
      fileFilter: function (req, file, fn) {

        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return fn(
            new BadRequestException('이미지 업로드는 .jpg .jpeg .png 확장자만 업로드 가능합니다.'),
            false
          )
        }
        return fn(null, true)
      },
      storage: multer.diskStorage({
        destination: function (req, res, fn) {
          fn(null, TEMP_FOLDER_PATH)
        },
        filename: function (req, file, fn) {

          fn(null, `${uuid()}${extname(file.originalname)}`)
        }
      })
    })
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule { }
