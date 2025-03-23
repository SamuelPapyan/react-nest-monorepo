import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './user.dto';
import { User } from './user.schema';
import mongoose from 'mongoose';
import { ResponseDTO } from 'src/app/response.dto';
import { ResponseManager } from 'src/app/managers/response.manager';
import { NotFoundException } from '@nestjs/common';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { AllExceptionFilter } from 'src/app/all-exception.filter';
import { messages } from 'src/app/config';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseFilters(AllExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly responseManager: ResponseManager<User>,
    private readonly exceptionManager: ExceptionManager,
  ) {}

  @Get()
  @Roles(Role.Admin, Role.Editor, Role.Viewer)
  async getUsers(@Query('q') query): Promise<ResponseDTO<User[]>> {
    const users = await this.userService.getUsers(query);
    return new ResponseManager<User[]>().getResponse(users, 'USERS_GENERATED');
  }

  @Get('coaches')
  @Roles(Role.Admin)
  async getCoaches(): Promise<ResponseDTO<string[]>> {
    const coaches = await this.userService.getCoaches();
    return new ResponseManager<string[]>().getResponse(
      coaches,
      'COACHES_GENERATED',
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Editor)
  async getById(@Param('id') id: string): Promise<ResponseDTO<User>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const user = await this.userService.getById(mongoId);
      if (!user) {
        throw new NotFoundException('USER_NOT_FOUND');
      }
      return this.responseManager.getResponse(user, 'USER_GET');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('avatar'))
  async addUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() userDto: UserDTO
  ):Promise<ResponseDTO<User>> {
    try {
      const user = await this.userService.addUser(
        userDto,
        avatar
      );
      return this.responseManager.getResponse(user, 'USER_ADDED');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @Roles(Role.Admin)
  async updateUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() userDto: UserDTO,
    @Param('id') id: string,
  ): Promise<ResponseDTO<User>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const user = await this.userService.updateUser(
        mongoId,
        userDto,
        avatar
      );
      if (!user) {
        throw new NotFoundException('USER_NOT_FOUND');
      }
      return this.responseManager.getResponse(user, 'USER_UPDATED');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteUser(@Param('id') id: string): Promise<ResponseDTO<User>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const user = await this.userService.deleteUser(mongoId);
      if (!user) {
        throw new NotFoundException('USER_NOT_FOUND');
      }
      return this.responseManager.getResponse(user, 'USER_DELETED');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}
