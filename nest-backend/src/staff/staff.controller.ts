import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UploadedFile, UseFilters, UseInterceptors } from "@nestjs/common";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { StaffService } from "./staff.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { Roles } from "src/roles/roles.decorator";
import { StaffRole } from "src/enums/staff-role.enum";
import { IResponse } from "src/interfaces/response.interface";
import { messages } from "src/constants/message.constants";
import mongoose from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { IStaff } from "./staff.interface";
import { ICountry } from "src/country/country.interface";
import { Staff } from "./staff.schema";

@Controller('staff')
@UseFilters(AllExceptionFilter)
export class StaffController {
    constructor(
        private readonly staffService: StaffService,
        private readonly responseManager: ResponseManager,
        private readonly exceptionManager: ExceptionManager,
    ) {}

    @Get()
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR, StaffRole.VIEWER, StaffRole.COACH)
    async getStaff(@Query('q') query, @Query('role') role): Promise<IResponse | undefined> {
        const users = await this.staffService.getUsers({query, role});
        return this.responseManager.getResponse(users, messages.STAFF_GENERATED);
    }

    @Get('coaches')
    @Roles(StaffRole.ADMIN)
    async getCoaches(): Promise<IResponse | any> {
        const coaches = await this.staffService.getCoaches();
        return this.responseManager.getResponse(
        coaches,
        messages.COACHES_GENERATED,
        );
    }

    @Post('login')
    async login(
        @Body() signInDto: Record<string, any>
    ): Promise<IResponse | undefined> {
        try {
            const payload = await this.staffService.signIn(
                signInDto.username,
                signInDto.password,
            );
            return this.responseManager.getResponse(
                payload.access_token,
                'Log In Successful',
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get('countries')
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR, StaffRole.VIEWER)
    async getCountries() {
        try {
            const data = await this.staffService.getCountries();
            return this.responseManager.getResponse(data, messages.COUNTRIES_GET)
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post('countries')
    @Roles(StaffRole.ADMIN)
    async addCountry(@Body() country: ICountry) {
        try {
            const data = await this.staffService.addCountry(country);
            return this.responseManager.getResponse(data, messages.COUNTRY_ADDED)
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put('countries/:id')
    @Roles(StaffRole.ADMIN)
    async updateCountry(@Param() id: string, @Body() country: ICountry) {
        try {
            const data = await this.staffService.updateCountry(country, id);
            return this.responseManager.getResponse(data, messages.COUNTRY_UPDATED)
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Delete('countries/:id')
    @Roles(StaffRole.ADMIN)
    async deleteCountry(@Param() id: string) {
        try {
            const data = await this.staffService.deleteCountry(id);
            return this.responseManager.getResponse(data, messages.COUNTRY_DELETED);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Get(':id')
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR, StaffRole.VIEWER)
    async getById(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
        const mongoId = new mongoose.Types.ObjectId(id);
        const user = await this.staffService.getById(mongoId);
        if (!user) {
            throw new NotFoundException(messages.STAFF_NOT_FOUND);
        }
        return this.responseManager.getResponse(user, messages.STAFF_GET);
        } catch (e) {
        this.exceptionManager.throwException(e);
        }
    }

    @Post()
    @Roles(StaffRole.ADMIN)
    @UseInterceptors(FileInterceptor('avatar'))
    async addUser(
        @UploadedFile() avatar: Express.Multer.File,
        @Body() userDto: IStaff
    ):Promise<IResponse | undefined> {
        try {
        const user = await this.staffService.addStaff(
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
    @Roles(StaffRole.ADMIN)
    async updateUser(
        @UploadedFile() avatar: Express.Multer.File,
        @Body() userDto: IStaff,
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
        try {
        const mongoId = new mongoose.Types.ObjectId(id);
        const user = await this.staffService.updateStaff(
            mongoId,
            userDto,
            avatar
        );
        if (!user) {
            throw new NotFoundException(messages.STAFF_NOT_FOUND);
        }
        return this.responseManager.getResponse(user, messages.STAFF_UPDATED);
        } catch (e) {
        this.exceptionManager.throwException(e);
        }
    }

    @Delete(':id')
    @Roles(StaffRole.ADMIN)
    async deleteUser(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const user = await this.staffService.deleteUser(mongoId);
            if (!user) {
                throw new NotFoundException(messages.STAFF_NOT_FOUND);
            }
            return this.responseManager.getResponse(user, messages.STAFF_DELETED);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }

    }
}