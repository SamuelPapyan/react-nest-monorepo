import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ResetPassword, ResetPasswordDocument } from "src/reset-password/reset-password.schema";
import { Staff, StaffDocument } from "src/staff/staff.schema";
import { Student, StudentDocument } from "src/students/student.schema";
import { MailerService} from '@nestjs-modules/mailer/dist'
import * as bcrypt from 'bcrypt'
import { UserType } from "src/enums/user-type.enum";

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    @InjectModel(Student.name) private studentsModel: Model<StudentDocument>,
    @InjectModel(ResetPassword.name)
    private resetPasswordModel: Model<ResetPasswordDocument>,
  ) {}

  async sendPasswordRecovery(
    email: string,
    userType: UserType,
  ): Promise<ResetPassword | null> {
    let user, url, data;
    if (userType == UserType.STAFF)
      user = await this.staffModel.findOne({ email });
    else user = await this.studentsModel.findOne({ email });
    if (user) {
      let encryptedId = await bcrypt.hash(
        user._id.toString(),
        10,
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
