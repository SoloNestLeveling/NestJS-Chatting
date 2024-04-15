import { PickType } from "@nestjs/mapped-types";
import { ChatsModel } from "../entity/chats.entity";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";



export class CreateChatDto extends PickType(ChatsModel, ['name', 'password']) {
}