import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { ResetPassword, ResetPasswordDocument } from './reset_password.schema';
import * as bcrypt from 'bcrypt';
import { hashConfig } from 'src/app/config';
import { Student, StudentDocument } from 'src/students/student.schema';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentsModel: Model<StudentDocument>,
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPasswordDocument>,
  ) {}

  async sendPasswordRecovery(
    email: string,
    userType: string,
  ): Promise<ResetPassword> {
    let user, url, data;
    if (userType == 'user')
      user = await this.userModel.findOne({ email: email });
    else user = await this.studentsModel.findOne({ email: email });
    if (user) {
      let encryptedId = await bcrypt.hash(
        user._id.toString(),
        hashConfig.SALT_OR_ROUNDS,
      );
      encryptedId = encryptedId.replaceAll('/', '');
      let existedUser: any = await this.resetPasswordModel
        .findOne({ user_id: user._id, user_type: userType })
        .exec();
      if (!existedUser) {
        existedUser = await new this.resetPasswordModel({
          user_id: user._id,
          hashed_id: encryptedId,
          expiration_date: Date.now() + 120 * 1000,
          user_type: userType,
        }).save();
      } else {
        existedUser = this.resetPasswordModel.findOneAndUpdate(
          { user_id: user._id, user_type: userType },
          {
            hashed_id: encryptedId,
            is_used: false,
            expiration_date: Date.now() + 120 * 1000,
          },
        );
      }
      url = `http://localhost:3000/admin/reset?id=${encryptedId}`;
      data = {
        to: user.email,
        subject: 'Password Recovery',
        template: './password_recovery',
        context: {
          username: user.username,
          url,
        },
      };
      if (userType == 'student') {
        url = `http://localhost:3000/reset?id=${encryptedId}`;
        data.subject = 'Student Password Recovery';
        data.template = './password_recovery_student';
        data.context.url = url;
        data.context.minutes = 2;
      }
      await this.mailerService.sendMail(data);
      return existedUser;
    }
    return null;
  }
}
