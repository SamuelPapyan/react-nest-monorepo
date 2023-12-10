import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from 'src/students/student.controller';
import { StudentService } from 'src/students/student.service';
import { Student, StudentSchema } from 'src/students/student.schema';
import { ResponseManager } from 'src/app/managers/response.manager';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import {
  ResetPassword,
  ResetPasswordSchema,
} from 'src/mail/reset_password.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: ResetPassword.name, schema: ResetPasswordSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '600s' },
    }),
    MailModule,
  ],
  controllers: [StudentController],
  providers: [
    StudentService,
    ResponseManager,
    ExceptionManager,
  ],
})
export class StudentsModule {}
