import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ChatsModel } from "./chats.entity";
import { IsString } from "class-validator";
import { UsersModel } from "src/users/entity/users.entity";
import { ImagesModel } from "src/images/entity/images.entity";

@Entity()
export class MessagesModel extends BaseModel {

    @Column()
    @IsString()
    message: string;

    @ManyToOne(() => ChatsModel, (chat) => chat.messages)
    chat: ChatsModel;

    @ManyToOne(() => UsersModel, (user) => user.messages)
    user: UsersModel;

    @OneToMany(() => ImagesModel, (image) => image.message)
    images: ImagesModel[];
}