import { IsNotEmpty, IsString } from "class-validator";

export class GroupChatDTO {
    @IsString()
    @IsNotEmpty()
    owner: string;

    @IsNotEmpty()
    @IsString()
    chat_name: string;

    members: string[];
}