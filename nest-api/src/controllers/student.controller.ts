import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
} from '@nestjs/common';
import { StudentService } from 'src/services/student.service';
import { StudentDTO } from 'src/dto/student.dto';
import { Student } from 'src/schemas/student.schema';
import mongoose from 'mongoose';
import { ResponseDTO } from 'src/dto/response.dto';
import { ResponseManager } from 'src/managers/response.manager';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ExceptionManager } from 'src/managers/exception.manager';
import { AllExceptionFilter } from 'src/filters/all-exception.filter';
import { messages } from 'src/config';

@Controller('students')
@UseFilters(AllExceptionFilter)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly responseManager: ResponseManager<Student>,
    private readonly exceptionManager: ExceptionManager,
  ) {}

  @Get()
  async getStudents(): Promise<ResponseDTO<Student[]>> {
    const students = await this.studentService.getStudents();
    return new ResponseManager<Student[]>().getResponse(
      students,
      messages.STUDENT_GENERATED,
    );
  }

  @Get(':id')
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
