import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { ResponseManager } from 'src/app/managers/response.manager';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { UserController } from './user.controller';
import {
  ResetPassword,
  ResetPasswordSchema,
} from 'src/mail/reset_password.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResetPassword.name, schema: ResetPasswordSchema },
    ]),
  ],
  providers: [UsersService, ResponseManager, ExceptionManager],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
