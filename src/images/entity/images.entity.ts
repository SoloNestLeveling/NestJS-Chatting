import { Transform } from "class-transformer";
import { IsEnum, IsInt } from "class-validator";
import { join } from "path";
import { ChatsModel } from "src/chats/entity/chats.entity";
import { MessagesModel } from "src/chats/entity/messages.entity";
import { BaseModel } from "src/common/base/entity.base";
import { PUBLIC_CHAT_IMAGE_PATH, PUBLIC_PROFILE_IMAGE_PATH } from "src/common/const/image-path.const";
import { Column, Entity, ManyToOne } from "typeorm";

export enum ImageTypeEnum {

    PROFILE_IMAGE = 'PROFILE_IMAGE',
    CHAT_IMAGE = 'CHAT_IMAGE',
}

@Entity()
export class ImagesModel extends BaseModel {

    @Column()
    @IsInt()
    order: number;


    @Column({ default: ImageTypeEnum.PROFILE_IMAGE })
    @IsEnum(ImageTypeEnum)
    type: ImageTypeEnum;


    @Column()
    @Transform(({ value, obj }) => {
        if (obj.type === ImageTypeEnum.PROFILE_IMAGE) {
            return `/${join(PUBLIC_PROFILE_IMAGE_PATH, value)}`
        } else {
            return `/${join(PUBLIC_CHAT_IMAGE_PATH, value)}`
        }
    })
    path: string;


    @ManyToOne(() => MessagesModel, (message) => message.images)
    message: MessagesModel;

    @ManyToOne(() => ChatsModel, (chat) => chat.images)
    chat: ChatsModel;
}