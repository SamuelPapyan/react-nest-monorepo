import { Module } from '@nestjs/common';
import { AppController } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { StudentsModule } from 'src/students/student.module';
import { StaffModule } from '../staff/staff.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { WorkshopModule } from 'src/workshop/workshop.module';
import { EventsModule } from 'src/events/events.module';
import { GroupChatModule } from 'src/group_chat/group_chat.module';
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis'; 
@Module({
  imports: [
    StudentsModule,
    StaffModule,
    AuthModule,
    UsersModule,
    WorkshopModule,
    GroupChatModule,
    MongooseModule.forRoot(
      'mongodb+srv://test1234:admin@cluster0.vugwe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    ),
    EventsModule,
    CacheModule.register<RedisClientOptions>({
      max: 100,
      ttl: 24 * 3600,
      store: redisStore,
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
