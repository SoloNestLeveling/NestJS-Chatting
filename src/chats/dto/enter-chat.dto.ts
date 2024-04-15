import { IsNumber, IsOptional, IsString } from "class-validator";

export class EnterChatDto {

    @IsNumber()
    chatId: number;

    @IsString()
    @IsOptional()
    password?: string;
}