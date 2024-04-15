import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { MessagesService } from './messages.service';
import { MessagesModel } from './entity/messages.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { ChatsGateWay } from './chats.gateway';
import { ImagesService } from 'src/images/images.service';
import { ImagesModel } from 'src/images/entity/images.entity';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      ChatsModel,
      MessagesModel,
      UsersModel,
      ImagesModel
    ])
  ],
  controllers: [ChatsController],
  providers: [
    ChatsGateWay,
    ChatsService,
    MessagesService,
    AuthService,
    UsersService,
    ImagesService,
  ],
})
export class ChatsModule { }
