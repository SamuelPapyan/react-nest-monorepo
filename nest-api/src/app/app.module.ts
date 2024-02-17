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
    MongooseModule.forRoot(
      'mongodb+srv://samvelpapyan1:tumo1234@cluster0.261k0xm.mongodb.net/?retryWrites=true&w=majority',
    ),
    EventsModule,
    CacheModule.register<RedisClientOptions>({
      ttl: 24 * 3600,
      store: redisStore,
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
