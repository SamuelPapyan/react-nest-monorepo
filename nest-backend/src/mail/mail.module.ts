import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/students/student.schema';
import { Staff, StaffSchema } from 'src/staff/staff.schema';
import { ResetPassword, ResetPasswordSchema } from 'src/reset-password/reset-password.schema';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "5a88cf80625588",
          pass: "b700de2a1b2a25"
        },
        secure: false,
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MongooseModule.forFeature([
      { name: Staff.name, schema: StaffSchema },
      { name: Student.name, schema: StudentSchema },
      { name: ResetPassword.name, schema: ResetPasswordSchema },
    ]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
