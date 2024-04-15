import { BaseModel } from "src/common/base/entity.base";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { MessagesModel } from "./messages.entity";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { ImagesModel } from "src/images/entity/images.entity";
import { ChatTypeEnum } from "../enum/chat.enum";




@Entity()
export class ChatsModel extends BaseModel {


    @Column()
    @IsString()
    name: string;

    @Column()
    @IsString()
    @IsOptional()
    password?: string;

    @Column()
    @IsOptional()
    @IsEnum(ChatTypeEnum)
    type?: ChatTypeEnum;



    @ManyToMany(() => UsersModel, (user) => user.chats)
    users: UsersModel[];

    @OneToMany(() => MessagesModel, (message) => message.chat)
    messages: MessagesModel[];

    @OneToMany(() => ImagesModel, (image) => image.chat)
    images: ImagesModel[]
}