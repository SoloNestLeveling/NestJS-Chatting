import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UsersModel } from 'src/users/entity/users.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user-id.decorator';
import { MessagesService } from './messages.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
    private readonly scheduler: SchedulerRegistry,
  ) { }


  @Get(':id')
  async getChatById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chatsService.getChatById(id)
  }


  @Get('messages/:id')
  @UseGuards(AccessTokenGuard)
  getMessage(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.messagesService.getMessages(id);
  }




  @Post('start')
  start() {
    const job = new CronJob('10 * * * * *', () => {
      console.log('run! cronSample');
    });

    job.start();
    console.log('start', job.lastDate());
  }

  @Post('stop')
  stop() {
    const job = new CronJob('10 * * * * *', () => {
      console.log('run! cronSample');
    });

    job.stop();
    console.log('stop', job.lastDate());
  }
}
