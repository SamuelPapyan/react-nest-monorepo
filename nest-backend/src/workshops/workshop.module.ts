import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Workshop, WorkshopSchema } from "./workshop.schema";
import { WorkshopController } from "./workshop.controller";
import { WorkshopService } from "./workshop.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { UploadService } from "src/upload/upload.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Workshop.name, schema: WorkshopSchema }])
    ],
    providers: [WorkshopService, ResponseManager, ExceptionManager, UploadService]
})
export class WorkshopModule {}