import { IsEmail, IsEnum, IsString } from "class-validator";
import { ChatsModel } from "src/chats/entity/chats.entity";
import { MessagesModel } from "src/chats/entity/messages.entity";
import { BaseModel } from "src/common/base/entity.base";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

export enum RolesTypeEnum {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

@Entity()
export class UsersModel extends BaseModel {

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    nickname: string;

    @Column({ default: RolesTypeEnum.USER })
    @IsEnum(RolesTypeEnum)
    role: RolesTypeEnum;


    @ManyToMany(() => ChatsModel, (chat) => chat.users)
    @JoinTable()
    chats: ChatsModel[];

    @OneToMany(() => MessagesModel, (message) => message.user)
    messages: MessagesModel[];
}