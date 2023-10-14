import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StudentDTO } from 'src/students/student.dto';
import { Student, StudentDocument } from 'src/students/student.schema';

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

  async getStudents(queryOb: any): Promise<Student[]> {
    const options = {};
    if (queryOb.query) {
      options['$or'] = [];
      options['$or'].push({
        full_name: { $regex: new RegExp(queryOb.query), $options: 'i' },
      });
      options['$or'].push({
        country: { $regex: new RegExp(queryOb.query), $options: 'i' },
      });
    }
    if (queryOb.best && queryOb.count) {
      return this.studentModel
        .find(options)
        .sort({ level: 'desc', experience: 'desc' })
        .limit(+queryOb.count)
        .exec();
    }
    return this.studentModel.find(options).exec();
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
