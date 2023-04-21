import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from 'src/controllers/student.controller';
import { StudentService } from 'src/services/student.service';
import { Student, StudentSchema } from 'src/schemas/student.schema';
import { ResponseManager } from 'src/managers/response.manager';
import { ExceptionManager } from 'src/managers/exception.manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [StudentController],
  providers: [StudentService, ResponseManager, ExceptionManager],
})
export class StudentsModule {}
