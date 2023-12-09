import { Module } from '@nestjs/common';
import { AppController } from 'src/app/app.controller';
import { AppService } from 'src/app/app.service';
import { StudentsModule } from 'src/students/student.module';
import { StaffModule } from '../staff/staff.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { WorkshopModule } from 'src/workshop/workshop.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
