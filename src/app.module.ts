import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { DB_DATABASE_KEY, DB_HOST_KEY, DB_PASSWORD_KEY, DB_PORT_KEY, DB_USERNAME_KEY } from './common/const/env-path.const';
import { UsersModel } from './users/entity/users.entity';
import { ChatsModel } from './chats/entity/chats.entity';
import { MessagesModel } from './chats/entity/messages.entity';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/image-path.const';
import { ImagesModel } from './images/entity/images.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public'
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env[DB_HOST_KEY],
      port: parseInt(process.env[DB_PORT_KEY]),
      username: process.env[DB_USERNAME_KEY],
      password: process.env[DB_PASSWORD_KEY],
      database: process.env[DB_DATABASE_KEY],
      entities: [
        UsersModel,
        ChatsModel,
        MessagesModel,
        ImagesModel,
      ],
      synchronize: true,
    }),
    UsersModule,
    ChatsModule,
    CommonModule,
    AuthModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  }],
})
export class AppModule { }
