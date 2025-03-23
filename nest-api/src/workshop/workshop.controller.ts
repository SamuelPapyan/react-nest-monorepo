import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AllExceptionFilter } from "src/app/all-exception.filter";
import { WorkshopService } from "./workshop.service";
import { ResponseManager } from "src/app/managers/response.manager";
import { Workshop } from "./workshop.schema";
import { ExceptionManager } from "src/app/managers/exception.manager";
import { Role } from "src/roles/role.enum";
import { ResponseDTO } from "src/app/response.dto";
import mongoose from "mongoose";
import { WorkshopDTO } from "./workshop.dto";
import { Roles } from "src/roles/roles.decorator";
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('workshops')
@UseFilters(AllExceptionFilter)
export class WorkshopController {
    constructor(
        private readonly workshopService: WorkshopService,
        private readonly responseManager: ResponseManager<Workshop>,
        private readonly exceptionManager: ExceptionManager,
    ) {}

    @Get()
    @Roles(Role.Viewer, Role.Editor, Role.Admin)
    async getWorkshops(
        @Query('q') query,
        @Query('studentName') username,
    ): Promise<ResponseDTO<Workshop[]>> {
        const workshops = await this.workshopService.getWorkshops(query, username);
        return new ResponseManager<Workshop[]>().getResponse(
            workshops,
            'WORKSHOPS_GENERATED_SUCCESSFULLY'
        );
    }

    @Get(':id')
    @Roles(Role.Editor, Role.Admin)
    async getById(@Param('id') id: string): Promise<ResponseDTO<Workshop>> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.getById(mongoId);
            if (!workshop) {
                throw new NotFoundException('WORKSHOP NOT FOUND');
            }
            return this.responseManager.getResponse(workshop, 'WORKSHOP GOT SUCCESSFULLY');
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Post()
    @Roles(Role.Admin)
    @UseInterceptors(FileInterceptor('cover_photo'))
    async addWorkshop(
        @UploadedFile() cover_photo: Express.Multer.File,
        @Body() workshopDto: WorkshopDTO,
    ): Promise<ResponseDTO<Workshop>> {
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
    @Roles(Role.Admin, Role.Editor)
    @UseInterceptors(FileInterceptor('cover_photo'))
    async updateWorkshop(
        @UploadedFile() cover_photo: Express.Multer.File,
        @Body() workshopDto: WorkshopDTO,
        @Param('id') id: string,
    ): Promise<ResponseDTO<Workshop>> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.updateWorkshop(
                mongoId,
                workshopDto,
                cover_photo
            );
            if (!workshop){
                throw new NotFoundException('WORKSHOP NOT FOUND');
            }
            return this.responseManager.getResponse(
                workshop,
                'WORKSHOP UPDATED SUCCESSFULLY'
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async deleteWorkshop(@Param('id') id: string): Promise<ResponseDTO<Workshop>> {
        try {
            const mongoId = new mongoose.Types.ObjectId(id);
            const workshop = await this.workshopService.deleteWorkshop(mongoId);
            if (!workshop) {
                throw new NotFoundException('WORKSHOP NOT FOUND')
            }
            return this.responseManager.getResponse(
                workshop,
                'WORKSHOP DELETED SUCCESSFULLY'
            )
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }
}