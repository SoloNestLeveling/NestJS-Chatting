import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesModel } from './entity/images.entity';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/create-image.dto';
import { basename, join } from 'path';
import { CHAT_IMAGE_FOLDER_PATH, PROFILE_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/image-path.const';
import { promises } from 'fs';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(ImagesModel)
        private readonly imagesRepository: Repository<ImagesModel>
    ) { }


    async createChatImage(dto: CreateImageDto) {

        const tempFile = join(
            TEMP_FOLDER_PATH,
            dto.path,
        );

        await promises.access(tempFile);

        const newFileName = basename(tempFile);


        const newFile = join(
            CHAT_IMAGE_FOLDER_PATH,
            newFileName,
        );

        const result = await this.imagesRepository.save({ ...dto });

        await promises.rename(tempFile, newFile);

        return result;

    }
}
