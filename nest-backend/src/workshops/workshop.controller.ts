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
}