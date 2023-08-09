import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { ResponseManager } from 'src/app/managers/response.manager';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService, ResponseManager, ExceptionManager],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
