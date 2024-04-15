import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { UsersModel } from "src/users/entity/users.entity";
import { UsersService } from "src/users/users.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { ChatsService } from "./chats.service";
import { MessagesService } from "./messages.service";
import { EnterChatDto } from "./dto/enter-chat.dto";
import { BadRequestException, ForbiddenException, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ImagesService } from "src/images/images.service";
import { ImageTypeEnum } from "src/images/entity/images.entity";
import { SchedulerRegistry } from "@nestjs/schedule";
import { SocketExceptionFilter } from "./exception/socket.exception";
import { ChatTypeEnum } from "./enum/chat.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatsModel } from "./entity/chats.entity";
import { Repository } from "typeorm";


@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateWay implements OnGatewayConnection {

    constructor(
        @InjectRepository(ChatsModel)
        private readonly chatsRepository: Repository<ChatsModel>,
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly chatsService: ChatsService,
        private readonly messagesService: MessagesService,
        private readonly imagesService: ImagesService,
    ) { }

    async handleConnection(socket: Socket & { user: UsersModel }): Promise<boolean> {

        console.log(`on connect websocket - ${socket.id}`)


        const headers = socket.handshake.headers

        const rawToken = headers['authorization']

        if (!rawToken) {
            socket.disconnect()
            throw new WsException({
                error: '토큰이 존재하지 않습니다.',
            });

        };

        try {

            const token = this.authService.extractTokenFromHeader(rawToken, true);
            const result = await this.authService.verifyToken(token);
            const user = await this.usersService.getUserByEmail(result.email);

            socket.user = user;

            return true;

        } catch (e) {

            socket.disconnect();
        };

    };



    @SubscribeMessage('create_chat')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketExceptionFilter)
    async createChat(
        @MessageBody() dto: CreateChatDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel }
    ) {

        const chat = await this.chatsService.createChat(dto, socket.user.id)

    }



    @SubscribeMessage('enter_chat')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        whitelist: true,
        forbidNonWhitelisted: true,
    }))
    @UseFilters(SocketExceptionFilter)
    async enterChat(
        @MessageBody() dto: EnterChatDto,
        @ConnectedSocket() socket: Socket & { user: UsersModel },
    ) {

        const chat = await this.chatsService.getChatById(dto.chatId);
        const user = await this.usersService.getUserById(socket.user.id);


        if (chat) {

            if (chat.type === ChatTypeEnum.OPEN) {


                if (!chat.users.find((a) => a.id === user.id)) {


                    chat.users = [...chat.users, user];
                    await this.chatsRepository.save(chat);
                    socket.join(dto.chatId.toString());

                } else {

                    throw new BadRequestException('이미 입장한 채팅방입니다.')
                };

            } else if (chat.type === ChatTypeEnum.PRIVATE) {

                if (chat.users.find((a) => a.id === user.id)) {

                    throw new BadRequestException('이미 입장중인 채팅방입니다.')
                } else if (dto.password === chat.password) {

                    chat.users = [...chat.users, user];
                    await this.chatsRepository.save(chat);
                    socket.join(dto.chatId.toString());
                } else {

                    throw new BadRequestException('패스워드가 틀렸습니다.')
                };
            };

        } else {

            throw new BadRequestException('존재하지 않는 채팅방입니다.')
        }

    };


    @SubscribeMessage('send_message')
    async sendMessage(
        @ConnectedSocket() socket: Socket & { user: UsersModel },
        @MessageBody() dto: CreateMessageDto
    ) {

        const chat = await this.chatsService.getChatById(dto.chatId)

        if (!chat) {
            throw new WsException({
                error: '서버에 문제가 있거나, 채팅방에 알 수 없는 오류가 발생했습니다.'
            })
        };


        const message = await this.messagesService.createMessage(dto, socket.user.id);

        for (let i = 0; i < dto.images.length; i++) {

            await this.imagesService.createChatImage({
                order: i + 1,
                type: ImageTypeEnum.CHAT_IMAGE,
                path: dto.images[i],
                message,
            });
        };



        socket.to(message.chat.id.toString()).emit('receive_message', message.message)


    }





} 