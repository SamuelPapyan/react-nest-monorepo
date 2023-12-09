import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Workshop, WorkshopSchema } from "./workshop.schema";
import { WorkshopController } from "./workshop.controller";
import { WorkshopService } from "./workshop.service";
import { ResponseManager } from "src/app/managers/response.manager";
import { ExceptionManager } from "src/app/managers/exception.manager";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Workshop.name, schema: WorkshopSchema}]),
    ],
    controllers: [WorkshopController],
    providers: [WorkshopService, ResponseManager, ExceptionManager],
})
export class WorkshopModule {}