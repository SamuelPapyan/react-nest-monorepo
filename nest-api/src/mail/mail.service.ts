import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async sendPasswordRecovery(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user)
      throw new NotFoundException(
        "This user hasn't registered with this email.",
      );
    const url = `http://localhost:3000/admin/reset?id=${user._id}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Recovery',
      template: './password_recovery',
      context: {
        username: user.username,
        url,
      },
    });
  }
}
