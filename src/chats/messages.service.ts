import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MessagesModel } from "./entity/messages.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";


@Injectable()
export class MessagesService {

    constructor(
        @InjectRepository(MessagesModel)
        private readonly messagesRepository: Repository<MessagesModel>
    ) { }

    async createMessage(dto: CreateMessageDto, userId: number) {

        const message = this.messagesRepository.create({
            chat: {
                id: dto.chatId
            },
            user: {
                id: userId
            },
            message: dto.message,
            images: []
        });

        const result = await this.messagesRepository.save(message);

        return this.messagesRepository.findOne({
            where: {
                id: result.id
            },
            relations: ['chat', 'images']
        })
    };


    async getMessages(id: number) {
        const message = await this.messagesRepository.findOne({
            where: {
                id,
            },
            relations: ['images']
        })
        return message;
    }
}