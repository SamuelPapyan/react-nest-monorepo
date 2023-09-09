import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
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

@Controller('users')
@UseFilters(AllExceptionFilter)
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly responseManager: ResponseManager<User>,
    private readonly exceptionManager: ExceptionManager,
  ) {}

  @Get()
  @Roles(Role.Admin)
  async getUsers(): Promise<ResponseDTO<User[]>> {
    const users = await this.userService.getUsers();
    return new ResponseManager<User[]>().getResponse(users, 'USERS_GENERATED');
  }

  @Get(':id')
  @Roles(Role.Admin)
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
  async addUser(@Body() userDto: UserDTO): Promise<ResponseDTO<User>> {
    try {
      const user = await this.userService.addUser(userDto);
      return this.responseManager.getResponse(user, 'USER_ADDED');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateUser(
    @Body() userDto: UserDTO,
    @Param('id') id: string,
  ): Promise<ResponseDTO<User>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const user = await this.userService.updateUser(mongoId, userDto);
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
