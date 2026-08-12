import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Student, StudentDocument } from "./student.schema";
import mongoose, { Model } from "mongoose";
import { IStudent } from "./student.interface";
import 'multer'
import { StudentQueryFilter } from "src/interfaces/students-query-filter.interface";
import * as bcrypt from 'bcrypt';
import { ResetPassword } from "src/reset-password/reset-password.schema";
import { UploadService } from "src/upload/upload.service";
import { UserType } from "src/enums/user-type.enum";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class StudentsService {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(ResetPassword.name) private resetPasswordModel: Model<ResetPassword>,
        private uploadService: UploadService,
        private jwtService: JwtService
    ) {}

    async addStudent(student: IStudent, avatar: Express.Multer.File): Promise<Student> {
        const newStudent = new this.studentModel(student);
        if (avatar) {
            const avatarUrl = await this.uploadService.uploadAvatar(avatar, student._id as string, UserType.STUDENT)
            newStudent.avatar = avatarUrl;
        }
        return await newStudent.save();
    }

    async getOne(username: string): Promise<StudentDocument | null> {
        return await this.studentModel.findOne({ username }).populate('coach', 'username fullName email')
    }

    async getById(id: mongoose.Types.ObjectId): Promise<StudentDocument | null> {
        const student = await this.studentModel.findById(id).populate('coach').exec();
        return student;
    }

    async getStudents(queryOb: StudentQueryFilter): Promise<(StudentDocument | null)[]> {
        const options = {}
        if (queryOb.query) {
            options['$or'] = [];
            options['$or'].push({
                'fullName.en': { $regex: new RegExp(queryOb.query), $options: 'i' },
            })
            options['$or'].push({
                'lastName.en': { $regex: new RegExp(queryOb.query), $options: 'i' },
            })
            options['$or'].push({
                'country.name.en' : { $regex: new RegExp(queryOb.query), $options: 'i' }
            });
            options['$or'].push({
                'country.name.am' : { $regex: new RegExp(queryOb.query), $options: 'i' }
            });
            options['$or'].push({
                email: { $regex: new RegExp(queryOb.query), $options: 'i' },
            });
            options['$or'].push({
                username: { $regex: new RegExp(queryOb.query), $options: 'i' },
            });
        }
        if (queryOb.coachId)
            options['coach._id'] = new mongoose.Types.ObjectId(queryOb.coachId);
        const students = await this.studentModel.aggregate([
            {
                $lookup: {
                    from: 'staffs',
                    localField: 'coach',
                    foreignField: '_id',
                    as: 'coach'
                },
            },
            {
                $lookup: {
                    from: 'countries',
                    localField: 'country',
                    foreignField: '_id',
                    as: 'country'
                },
            },
            { $unwind: {
                path: '$coach',
                preserveNullAndEmptyArrays: true
            }},
            { $unwind: {
                path: '$country',
                preserveNullAndEmptyArrays: true
            }},
            ...(Object.keys(options).length ? [{$match: options }] : []),
            ...(queryOb.best ? [{ $sort: { ['level']: -1 as -1 } }] : []),
            ...(queryOb.count ? [{ $limit: +queryOb.count }] : [])
        ]);
        const studs = await this.studentModel.find(options).populate('coach').populate('country');
        return students;
    }

    async updateStudent(
        id: mongoose.Types.ObjectId,
        student: IStudent,
        avatar: Express.Multer.File
    ): Promise<Student | null> {
        const updated = await this.studentModel.findByIdAndUpdate(id, student);
        if (avatar) {
            const avatarUrl = await this.uploadService.uploadAvatar(avatar, id.toString(), UserType.STUDENT);
            const student = await this.studentModel.findById(id);
            if (!student) throw new NotFoundException();
            student.avatar = avatarUrl;
            return student.save();
        }
        return updated;
    }

    async deleteStudent(id: mongoose.Types.ObjectId): Promise<Student | null> {
        const tmp = await this.studentModel.findById(id);
        if (!tmp) throw new NotFoundException();
        const avatar = this.uploadService.getPublicId(tmp.avatar);
        this.uploadService.removeFile(avatar).then(console.log);
        const student = this.studentModel.findByIdAndDelete(id);
        return student;
    }

    async signIn(username: string, password: string): Promise<any> {
        const student = await this.studentModel.findOne({username}).populate('coach', 'username firstName lastName email');
        if (!student) throw new NotFoundException();
        if (!(await bcrypt.compare(password, student.password)))
            throw new UnauthorizedException();
        const { _id, fullName, email, coach} = student;
        return {
            access_token: await this.jwtService.signAsync({_id, fullName, email, username, coach})
        }
    }

    async getResetPasswordDto(id: string): Promise<ResetPassword | null> {
        const data = await this.resetPasswordModel.findOne({
            hashed_id: id,
            user_type:'student'
        });
        return data;
    }

    async resetPassword(
        id: mongoose.Types.ObjectId,
        password: string,
    ): Promise<Student> {
        const student = await this.studentModel.findById(id);
        if (!student) 
            throw new NotFoundException();
        student.password = password
        await this.resetPasswordModel.findOneAndUpdate(
            { user_id: id, user_type: 'student' },
            { is_used: true },
        );
        return await student.save();
    }
}