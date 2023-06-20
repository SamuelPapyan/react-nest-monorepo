import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from 'src/students/student.controller';
import { StudentService } from 'src/students/student.service';
import { Student, StudentSchema } from 'src/students/student.schema';
import { ResponseManager } from 'src/app/managers/response.manager';
import { ExceptionManager } from 'src/app/managers/exception.manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [StudentController],
  providers: [StudentService, ResponseManager, ExceptionManager],
})
export class StudentsModule {}
