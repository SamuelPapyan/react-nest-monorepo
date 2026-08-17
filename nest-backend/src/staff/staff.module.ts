import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Staff, StaffSchema } from "./staff.schema";
import { Student, StudentSchema } from "src/students/student.schema";
import { Workshop, WorkshopSchema } from "src/workshops/workshop.schema";
import { ResetPassword, ResetPasswordSchema } from "src/reset-password/reset-password.schema";
import { StaffService } from "./staff.service";
import { StudentsService } from "src/students/students.service";
import { WorkshopService } from "src/workshops/workshop.service";
import { GroupChatService } from "src/group-chat/group-chat.service";
import { WorkshopDetails, WorkshopDetailsSchema } from "src/workshops/workshop-details.schema";
import { Announcement, AnnouncementSchema } from "src/workshops/announcement.schema";
import { Assignment, AssignmentSchema } from "src/workshops/assignment.schema";
import { AssignmentUpload, AssignmentUploadSchema } from "src/workshops/assignment-upload.schema";
import { Attendee, AttendeeSchema } from "src/workshops/attendee.schema";
import { Comment, CommentSchema } from "src/workshops/comment.schema";
import { MailService } from "src/mail/mail.service";
import { GroupChat, GroupChatSchema } from "src/group-chat/group-chat.schema";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { UploadService } from "src/upload/upload.service";
import { StaffController } from "./staff.controller";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/guards/roles.guard";
import { Country, CountrySchema } from "src/country/country.schema";
import { JwtService, JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/constants/auth.constants";
import { CacheModule } from "@nestjs/cache-manager";
import Keyv from "keyv";
import { CacheableMemory } from "cacheable";
import KeyvRedis from "@keyv/redis";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Staff.name, schema: StaffSchema },
            { name: Student.name, schema: StudentSchema },
            { name: Workshop.name, schema: WorkshopSchema },
            { name: ResetPassword.name, schema: ResetPasswordSchema },
            { name: Country.name, schema: CountrySchema },
            { name: GroupChat.name, schema: GroupChatSchema },
            { name: WorkshopDetails.name, schema: WorkshopDetailsSchema },
            { name: Announcement.name, schema: AnnouncementSchema },
            { name: Assignment.name, schema: AssignmentSchema },
            { name: AssignmentUpload.name, schema: AssignmentUploadSchema },
            { name: Attendee.name, schema: AttendeeSchema },
            { name: Comment.name, schema: CommentSchema },
        ]),
        JwtModule.register({
            secret: jwtConstants.staffSecret,
            signOptions: { expiresIn: '30d' }
        }),
        CacheModule.registerAsync({
            useFactory: async () => {
                return {
                stores: [
                    new Keyv({
                    store: new CacheableMemory({ ttl: 24 * 3600 * 1000, lruSize: 5000 })
                    }),
                    new KeyvRedis('redis://locahost:6379')
                ]
                }
            }
        })
    ],
    providers: [
        StudentsService,
        StaffService,
        WorkshopService,
        GroupChatService,
        MailService,
        ResponseManager,
        ExceptionManager,
        UploadService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    controllers: [StaffController],
    exports: [StaffService]
})
export class StaffModule {}