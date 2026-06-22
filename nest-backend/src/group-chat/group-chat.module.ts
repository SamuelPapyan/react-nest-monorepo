import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Student, StudentSchema } from "src/students/student.schema";
import { UploadService } from "src/upload/upload.service";
import { GroupChat, GroupChatSchema } from "./group-chat.schema";
import { Workshop, WorkshopSchema } from "src/workshops/workshop.schema";
import { Staff, StaffSchema } from "src/staff/staff.schema";
import { GroupChatService } from "./group-chat.service";
import { ChatService } from "src/chat/chat.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { WorkshopService } from "src/workshops/workshop.service";
import { ChatGateway } from "src/chat/chat.gateway";
import { GroupChatController } from "./group-chat.controller";
import { CacheModule } from "@nestjs/cache-manager";
import Keyv from "keyv";
import { CacheableMemory } from "cacheable";
import KeyvRedis from "@keyv/redis";


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupChat.name, schema: GroupChatSchema },
      { name: Workshop.name, schema: WorkshopSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 24 * 3600 * 1000, lruSize: 5000 })
            }),
            new KeyvRedis('redis://localhost:6379')
          ]
        }
      }
    })
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