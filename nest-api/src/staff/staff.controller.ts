import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StaffService } from 'src/staff/staff.service';
import { StaffDTO } from 'src/staff/staff.dto';
import { Staff } from 'src/staff/staff.schema';
import mongoose from 'mongoose';
import { ResponseDTO } from 'src/app/response.dto';
import { ResponseManager } from 'src/app/managers/response.manager';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { messages } from 'src/app/config';
import { AllExceptionFilter } from 'src/app/all-exception.filter';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('staff')
@UseFilters(AllExceptionFilter)
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly responseManager: ResponseManager<Staff>,
    private readonly exceptionManager: ExceptionManager,
  ) {}

  @Get()
  @Roles(Role.Viewer, Role.Editor, Role.Admin)
  async getStaff(@Query('q') query): Promise<ResponseDTO<Staff[]>> {
    const staffs = await this.staffService.getStaffs(query);
    return new ResponseManager<Staff[]>().getResponse(
      staffs,
      messages.STAFF_GENERATED,
    );
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Editor)
  async getById(@Param('id') id: string): Promise<ResponseDTO<Staff>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const staff = await this.staffService.getById(mongoId);
      if (!staff) {
        throw new NotFoundException(messages.STUDENT_NOT_FOUND);
      }
      return this.responseManager.getResponse(staff, messages.STAFF_GET);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post()
  @Roles(Role.Admin)
  async addStaff(@Body() staffDto: StaffDTO): Promise<ResponseDTO<Staff>> {
    try {
      const staff = await this.staffService.addStaff(staffDto);
      return this.responseManager.getResponse(staff, messages.STAFF_ADDED);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateStaff(
    @Body() staffDto: StaffDTO,
    @Param('id') id: string,
  ): Promise<ResponseDTO<Staff>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const staff = await this.staffService.updateStaff(mongoId, staffDto);
      if (!staff) {
        throw new NotFoundException(messages.STAFF_NOT_FOUND);
      }
      return this.responseManager.getResponse(staff, messages.STAFF_UPDATED);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteStaff(@Param('id') id: string): Promise<ResponseDTO<Staff>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const staff = await this.staffService.deleteStaff(mongoId);
      if (!staff) {
        throw new NotFoundException(messages.STAFF_NOT_FOUND);
      }
      return this.responseManager.getResponse(staff, messages.STAFF_DELETED);
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}
