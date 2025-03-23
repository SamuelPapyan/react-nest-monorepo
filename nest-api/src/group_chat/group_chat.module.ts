import { Module } from "@nestjs/common";
import { GroupChatService } from "./group_chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupChat, GroupChatSchema } from "./group_chat.schema";
import { ResponseManager } from "src/app/managers/response.manager";
import { ExceptionManager } from "src/app/managers/exception.manager";
import { GroupChatController } from "./group_chat.controller";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { WorkshopService } from "src/workshop/workshop.service";
import { Workshop, WorkshopSchema } from "src/workshop/workshop.schema";
import { User, UserSchema } from "src/users/user.schema";
import { Student, StudentSchema } from "src/students/student.schema";
import { UploadService } from "src/upload/upload.service";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupChat.name, schema: GroupChatSchema },
      { name: Workshop.name, schema: WorkshopSchema },
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  providers: [
    GroupChatService,
    ChatService,
    ChatGateway,
    ResponseManager,
    ExceptionManager,
    WorkshopService,
    UploadService
  ],
  controllers: [GroupChatController],
})
export class GroupChatModule {}