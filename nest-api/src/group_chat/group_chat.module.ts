import { Module } from "@nestjs/common";
import { GroupChatService } from "./group_chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupChat, GroupChatSchema } from "./group_chat.schema";
import { ResponseManager } from "src/app/managers/response.manager";
import { ExceptionManager } from "src/app/managers/exception.manager";
import { GroupChatController } from "./group_chat.controller";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupChat.name, schema: GroupChatSchema },
    ]),
  ],
  providers: [GroupChatService, ResponseManager, ExceptionManager],
  controllers: [GroupChatController],
})
export class GroupChatModule {}