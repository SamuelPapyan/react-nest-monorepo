import { IsNotEmpty, IsString } from "class-validator";

export class IGroupChat {
    owner: string;
    chat_name: string;
    members: string[];
}