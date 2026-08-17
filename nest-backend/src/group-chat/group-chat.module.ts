import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Student, StudentSchema } from "src/students/student.schema";
import { WorkshopDetails, WorkshopDetailsSchema } from "src/workshops/workshop-details.schema";
import { Announcement, AnnouncementSchema } from "src/workshops/announcement.schema";
import { Assignment, AssignmentSchema } from "src/workshops/assignment.schema";
import { AssignmentUpload, AssignmentUploadSchema } from "src/workshops/assignment-upload.schema";
import { Attendee, AttendeeSchema } from "src/workshops/attendee.schema";
import { Comment, CommentSchema } from "src/workshops/comment.schema";
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
      { name: GroupChat.name, schema: GroupChatSchema },
      { name: WorkshopDetails.name, schema: WorkshopDetailsSchema },
      { name: Announcement.name, schema: AnnouncementSchema },
      { name: Assignment.name, schema: AssignmentSchema },
      { name: AssignmentUpload.name, schema: AssignmentUploadSchema },
      { name: Attendee.name, schema: AttendeeSchema },
      { name: Comment.name, schema: CommentSchema },
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
})
export class GroupChatModule {}