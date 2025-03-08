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
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPassword>,
    private jwtService: JwtService,
  ) {}

  async addStudent(
    studentDTO: StudentDTO,
    avatar: Express.Multer.File,
  ): Promise<Student> {
    studentDTO.password = await bcrypt.hash(
      studentDTO.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    const createdStudent = new this.studentModel(studentDTO);
    if (avatar) {
      const avatarUrl = await this.uploadAvatar(avatar, studentDTO['username'])
      createdStudent.avatar = avatarUrl;
    }
    return createdStudent.save();
  }

  private getPublicId(url: string): string {
    const uri = new URL(url);
    return uri.pathname.split('/').slice(5).join('/').split('.')[0];
  }

  private async uploadAvatar(
    avatar: Express.Multer.File,
    username: string,
  ): Promise<string> {
    const mimeType = avatar.mimetype;
    const base64Data = avatar.buffer.toString('base64');
    cloudinary.config({ 
      cloud_name: 'drwi32qkb', 
      api_key: '685351825318234', 
      api_secret: 'B34F6ZA_5QKaqFx1L-mqR-8N6fQ'
    });
    await cloudinary.uploader.destroy(`user_data/avatar_${username}`);
    const uploadResult = await cloudinary.uploader
      .upload(`data:${mimeType};base64,${base64Data}`, {
        public_id: `avatar_${username}`,
        folder: 'user_data'
      })
      .catch((error) => {
        console.log(error);
    });
    return uploadResult['url'];
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
        full_name_en: { $regex: new RegExp(queryOb.query), $options: 'i' },
      });
      options['$or'].push({
        full_name_hy: { $regex: new RegExp(queryOb.query), $options: 'i' },
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
    avatar: Express.Multer.File
  ): Promise<Student> {
    studentDto.password = await bcrypt.hash(
      studentDto.password,
      hashConfig.SALT_OR_ROUNDS,
    );
    const student = this.studentModel.findByIdAndUpdate(id, studentDto);
    if (avatar) {
      const avatarUrl = await this.uploadAvatar(avatar, studentDto['username'])
      const student = await this.studentModel.findById(id);
      student.avatar = avatarUrl;
      return student.save();
    }
    return student;
  }

  async deleteStudent(id: mongoose.Types.ObjectId): Promise<Student> {
    const tmp = await this.studentModel.findById(id);
    const avatar = this.getPublicId(tmp.avatar);
    const student = this.studentModel.findByIdAndDelete(id);
    cloudinary.uploader.destroy(avatar).then(console.log);
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
      avatar: user.avatar
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
