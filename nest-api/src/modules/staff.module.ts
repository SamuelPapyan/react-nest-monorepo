import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StaffController } from "src/controllers/staff.controller";
import { StaffService } from "src/services/staff.service";
import { Staff, StaffSchema } from "src/schemas/staff.schema";
import { ResponseManager } from "src/managers/response.manager";
import { ExceptionManager } from "src/managers/exception.manager";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }])
    ],
    controllers: [StaffController],
    providers: [StaffService, ResponseManager, ExceptionManager],
})
export class StaffModule {}
