import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
  Query,
} from '@nestjs/common';
import { StudentService } from 'src/students/student.service';
import { StudentDTO } from 'src/students/student.dto';
import { Student } from 'src/students/student.schema';
import mongoose from 'mongoose';
import { ResponseDTO } from 'src/app/response.dto';
import { ResponseManager } from 'src/app/managers/response.manager';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { AllExceptionFilter } from 'src/app/all-exception.filter';
import { messages } from 'src/app/config';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('students')
@UseFilters(AllExceptionFilter)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly responseManager: ResponseManager<Student>,
    private readonly exceptionManager: ExceptionManager,
  ) {}

  @Get()
  @Roles(Role.Viewer, Role.Editor, Role.Admin)
  async getStudents(
    @Query('q') query,
    @Query('best') best,
    @Query('count') count,
  ): Promise<ResponseDTO<Student[]>> {
    const students = await this.studentService.getStudents({
      query,
      best,
      count,
    });
    return new ResponseManager<Student[]>().getResponse(
      students,
      messages.STUDENT_GENERATED,
    );
  }

  @Get(':id')
  @Roles(Role.Editor, Role.Admin)
  async getById(@Param('id') id: string): Promise<ResponseDTO<Student>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const student = await this.studentService.getById(mongoId);
      if (!student) {
        throw new NotFoundException(messages.STUDENT_NOT_FOUND);
      }
      return this.responseManager.getResponse(student, messages.STUDENT_GET);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post()
  @Roles(Role.Admin)
  async addStudent(
    @Body() studentDto: StudentDTO,
  ): Promise<ResponseDTO<Student>> {
    try {
      const student = await this.studentService.addStudent(studentDto);
      return this.responseManager.getResponse(student, messages.STUDENT_ADDED);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Editor)
  async updateStudent(
    @Body() studentDto: StudentDTO,
    @Param('id') id: string,
  ): Promise<ResponseDTO<Student>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const student = await this.studentService.updateStudent(
        mongoId,
        studentDto,
      );
      if (!student) {
        throw new NotFoundException(messages.STUDENT_NOT_FOUND);
      }
      return this.responseManager.getResponse(
        student,
        messages.STUDENT_UPDATED,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteStudent(@Param('id') id: string): Promise<ResponseDTO<Student>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const student = await this.studentService.deleteStudent(mongoId);
      if (!student) {
        throw new NotFoundException(messages.STUDENT_NOT_FOUND);
      }
      return this.responseManager.getResponse(
        student,
        messages.STUDENT_DELETED,
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}
