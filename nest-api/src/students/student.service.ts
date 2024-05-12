import mongoose, { Model } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StudentDTO } from 'src/students/student.dto';
import { Student, StudentDocument } from 'src/students/student.schema';
import * as bcrypt from 'bcrypt';
import { hashConfig } from '../app/config';
import { JwtService } from '@nestjs/jwt';
import { ResetPassword } from 'src/mail/reset_password.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPassword>,
    private jwtService: JwtService,
  ) {}

  async addStudent(studentDTO: StudentDTO): Promise<Student> {
    studentDTO.password = await bcrypt.hash(
      studentDTO.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    const createdStudent = new this.studentModel(studentDTO);
    return createdStudent.save();
  }

  async findOne(username: string): Promise<Student | any> {
    return this.studentModel.findOne({ username: username }).lean();
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
      options['$or'].push({
        email: { $regex: new RegExp(queryOb.query), $options: 'i' },
      });
      options['$or'].push({
        username: { $regex: new RegExp(queryOb.query), $options: 'i' },
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
    studentDto.password = await bcrypt.hash(
      studentDto.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    const student = this.studentModel.findByIdAndUpdate(id, studentDto);
    return student;
  }

  async deleteStudent(id: mongoose.Types.ObjectId): Promise<Student> {
    const student = this.studentModel.findByIdAndDelete(id);
    return student;
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
    if (!user) throw new NotFoundException();
    if (!(await bcrypt.compare(pass, user.password)))
      throw new UnauthorizedException();
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      country: user.country,
      level: user.level,
      experience: user.experience,
      max_experience: user.max_experience,
      coach: user.coach,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getResetPasswordDto(id: string): Promise<ResetPassword> {
    const data = await this.resetPasswordModel.findOne({
      hashed_id: id,
      user_type: 'student',
    });
    return data;
  }

  async resetPassword(
    id: mongoose.Types.ObjectId,
    password: string,
  ): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    student.password = await bcrypt.hash(password, hashConfig.SALT_OR_ROUNDS);
    await this.resetPasswordModel.findOneAndUpdate(
      { user_id: id, user_type: 'student' },
      { is_used: true },
    );
    return student.save();
  }

  async getStudentsByCoach(coach: string): Promise<any> {
    const data = await this.studentModel.find({ coach: coach }).lean().exec();
    const result = data.map((value) => {
      return {
        id: value._id,
        username: value.username
      }
    });
    return result;
  }

  async getStudentByUsername(username: string): Promise<Student> {
    return this.studentModel.findOne({ username: username }).exec();
  }
}
