import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Staff, StaffSchema } from "./staff.schema";
import { ResetPassword, ResetPasswordSchema } from "src/reset-password/reset-password.schema";
import { StaffService } from "./staff.service";
import { ResponseManager } from "src/manager/response.manager";
import { ExceptionManager } from "src/manager/exception.manager";
import { UploadService } from "src/upload/upload.service";
import { StaffController } from "./staff.controller";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "src/guards/roles.guard";
import { Country, CountrySchema } from "src/country/country.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Staff.name, schema: StaffSchema },
            { name: ResetPassword.name, schema: ResetPasswordSchema },
            { name: Country.name, schema: CountrySchema }
        ]),
    ],
    providers: [StaffService, ResponseManager, ExceptionManager, UploadService, {
        provide: APP_GUARD,
        useClass: RolesGuard
    }],
    controllers: [StaffController],
    exports: [StaffService]
})
export class StaffModule {}