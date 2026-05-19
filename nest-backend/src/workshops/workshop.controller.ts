import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UploadedFile, UseFilters, UseInterceptors } from "@nestjs/common";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { WorkshopService } from "./workshop.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { Roles } from "src/roles/roles.decorator";
import { StaffRole } from "src/enums/staff-role.enum";
import { IResponse } from "src/interfaces/response.interface";
import { messages } from "src/constants/message.constants";
import mongoose from "mongoose";
import { FileInterceptor } from "@nestjs/platform-express";
import { IWorkshop } from "./workshop.interface";

@Controller('workshops')
@UseFilters(AllExceptionFilter)
export class WorkshopController {
    constructor(
        private readonly workshopService: WorkshopService,
        private readonly responseManager: ResponseManager,
        private readonly exceptionManager: ExceptionManager,
    ) {}

    @Get()
    @Roles(StaffRole.VIEWER, StaffRole.EDITOR, StaffRole.ADMIN)
    async getWorkshops(
        @Query('q') query,
        @Query('stundentName') student
    ): Promise<IResponse> {
        const workshops = await this.workshopService.getWorkshops({query, student})
        return this.responseManager.getResponse(
            workshops,
            messages.WORKSHOPS_GENERATED_SUCCESSFULLY
        );
    }

    @Get(':id')
    @Roles(StaffRole.EDITOR, StaffRole.ADMIN)
    async getById(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.getById(mongoId);
            if (!workshop) {
                throw new NotFoundException();
            }
            return this.responseManager.getResponse(workshop, messages.WORKSHOP_NOT_FOUND);
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post()
    @Roles(StaffRole.ADMIN)
    @UseInterceptors(FileInterceptor('cover_photo'))
    async addWorkshop(
        @UploadedFile() cover_photo: Express.Multer.File,
        @Body() workshopDto: IWorkshop,
    ): Promise<IResponse | undefined> {
        try {
            const workshop = await this.workshopService.addWorkshop(
                workshopDto,
                cover_photo
            );
            return this.responseManager.getResponse(workshop, 'WORKSHOP ADDED SUCCESSFULLY');
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Put(':id')
    @Roles(StaffRole.ADMIN, StaffRole.EDITOR)
    @UseInterceptors(FileInterceptor('cover_photo'))
    async updateWorkshop(
        @UploadedFile() cover_photo: Express.Multer.File,
        @Body() workshopDto: IWorkshop,
        @Param('id') id: string,
    ): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.updateWorkshop(
                mongoId,
                workshopDto,
                cover_photo
            );
            if (!workshop){
                throw new NotFoundException(messages.WORKSHOP_NOT_FOUND);
            }
            return this.responseManager.getResponse(
                workshop,
                messages.WORKSHOP_UPDATED_SUCCESSFULLY
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Delete(':id')
    @Roles(StaffRole.ADMIN)
    async deleteWorkshop(@Param('id') id: string): Promise<IResponse | undefined> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.deleteWorkshop(mongoId);
            if (!workshop) {
                throw new NotFoundException(messages.WORKSHOP_NOT_FOUND)
            }
            return this.responseManager.getResponse(
                workshop,
                messages.WORKSHOP_DELETED_SUCCESSFULLY
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }
}