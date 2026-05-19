import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { WorkshopModule } from './workshops/workshop.module';
import { GroupChatModule } from './group-chat/group-chat.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/react-nest-monorepo'),
    StudentsModule,
    AuthModule,
    StaffModule,
    WorkshopModule,
    GroupChatModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
