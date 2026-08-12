import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Student, StudentSchema } from "./student.schema";
import { ResetPassword, ResetPasswordSchema } from "src/reset-password/reset-password.schema";
import { Workshop, WorkshopSchema } from "src/workshops/workshop.schema";
import { Portfolio, PortfolioSchema } from "src/portfolio/portfolio.schema";
import { GroupChat, GroupChatSchema } from "src/group-chat/group-chat.schema";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/constants/auth.constants";
import { MailModule } from "src/mail/mail.module";
import { StudentController } from "./student.controller";
import { StudentsService } from "./students.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { WorkshopService } from "src/workshops/workshop.service";
import { PortfolioService } from "src/portfolio/portfolio.service";
import { GroupChatService } from "src/group-chat/group-chat.service";
import { UploadService } from "src/upload/upload.service";
import { CacheModule } from "@nestjs/cache-manager";
import Keyv from "keyv";
import { CacheableMemory } from "cacheable";
import KeyvRedis from "@keyv/redis";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Student.name, schema: StudentSchema },
            { name: ResetPassword.name, schema: ResetPasswordSchema },
            { name: Workshop.name, schema: WorkshopSchema },
            { name: Portfolio.name, schema: PortfolioSchema},
            { name: GroupChat.name, schema: GroupChatSchema }
        ]),

        JwtModule.register({
            secret: jwtConstants.studentSecret,
            signOptions: { expiresIn: '30d'},
        }),
        MailModule,
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
    controllers: [StudentController],
    providers: [
        StudentsService,
        ResponseManager,
        ExceptionManager,
        WorkshopService,
        PortfolioService,
        GroupChatService,
        UploadService
    ]
})
export class StudentsModule {}