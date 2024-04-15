import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UsersService } from 'src/users/users.service';
import { ChatTypeEnum } from './enum/chat.enum';

@Injectable()
export class ChatsService {

    constructor(
        @InjectRepository(ChatsModel)
        private readonly chatsRepository: Repository<ChatsModel>,
        private readonly usersService: UsersService
    ) { }


    async createChat(dto: CreateChatDto, userId: number) {

        const user = await this.usersService.getUserById(userId)

        const chat = this.chatsRepository.create({

            users: [user],
            name: dto.name,
            password: dto.password,
            type: dto.password ? ChatTypeEnum.PRIVATE : ChatTypeEnum.OPEN
        });

        const result = await this.chatsRepository.save(chat);

        return result;
    }


    async getChatById(id: number) {
        const chat = await this.chatsRepository.findOne({
            where: {
                id,
            },
            relations: ['messages', 'messages.images'],
            select: {
                messages: {
                    id: true,
                    message: true,
                    images: {
                        id: true,
                        path: true
                    }
                }
            }
        });

        return chat;
    }
}
