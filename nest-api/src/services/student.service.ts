import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StudentDTO } from 'src/dto/student.dto';
import { Student, StudentDocument } from 'src/schemas/student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async addStudent(studentDTO: StudentDTO): Promise<Student> {
    const createdStudent = new this.studentModel(studentDTO);
    return createdStudent.save();
  }

  async getById(id: mongoose.Types.ObjectId): Promise<Student> {
    const student = this.studentModel.findById(id);
    return student;
  }

  async getStudents(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async updateStudent(
    id: mongoose.Types.ObjectId,
    studentDto: StudentDTO,
  ): Promise<Student> {
    const student = this.studentModel.findByIdAndUpdate(id, studentDto);
    return student;
  }

  async deleteStudent(id: mongoose.Types.ObjectId): Promise<Student> {
    const student = this.studentModel.findByIdAndDelete(id);
    return student;
  }
}
