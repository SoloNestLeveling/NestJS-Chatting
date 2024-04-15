import { PickType } from "@nestjs/mapped-types";
import { MessagesModel } from "../entity/messages.entity";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMessageDto extends PickType(MessagesModel, ['message']) {
    @IsNumber()
    chatId: number;

    @IsString({ each: true })
    @IsOptional()
    images: string[] = [];
}