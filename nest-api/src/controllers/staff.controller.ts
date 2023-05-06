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
import { StaffService } from 'src/services/staff.service';
import { StaffDTO } from 'src/dto/staff.dto';
import { Staff } from 'src/schemas/staff.schema';
import mongoose from 'mongoose';
import { ResponseDTO } from 'src/dto/response.dto';
import { ResponseManager } from 'src/managers/response.manager';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ExceptionManager } from 'src/managers/exception.manager';
import { AllExceptionFilter } from 'src/filters/all-exception.filter';
import { messages } from 'src/config';
import { StaffValidationPipe } from 'src/pipes/staff-validation.pipe';

@Controller('staff')
@UseFilters(AllExceptionFilter)
export class StaffController {
    constructor(
        private readonly staffService: StaffService,
        private readonly responseManager: ResponseManager<Staff>,
        private readonly exceptionManager: ExceptionManager,
    ) {}

    @Get()
    async getStaff(): Promise<ResponseDTO<Staff[]>> {
        const staffs = await this.staffService.getStaffs();
        return new ResponseManager<Staff[]>().getResponse(
            staffs,
            messages.STAFF_GENERATED,
        );
    }

    @Get(':id')
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
    async addStaff(
        @Body(new StaffValidationPipe()) staffDto: StaffDTO,
    ) : Promise<ResponseDTO<Staff>> {
        try {
            const staff = await this.staffService.addStaff(staffDto);
            return this.responseManager.getResponse(staff, messages.STAFF_ADDED);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put(':id')
    async updateStaff(
        @Body(new StaffValidationPipe()) staffDto: StaffDTO,
        @Param('id') id: string,
    ): Promise<ResponseDTO<Staff>> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const staff = await this.staffService.updateStaff(
                mongoId,
                staffDto,
            );
            if (!staff) {
                throw new NotFoundException(messages.STAFF_NOT_FOUND);
            }
            return this.responseManager.getResponse(
                staff,
                messages.STAFF_UPDATED,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Delete(':id')
    async deleteStaff(@Param('id') id: string): Promise<ResponseDTO<Staff>> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const staff = await this.staffService.deleteStaff(mongoId);
            if (!staff) {
                throw new NotFoundException(messages.STAFF_NOT_FOUND);
            }
            return this.responseManager.getResponse(
                staff,
                messages.STAFF_DELETED,
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }
}