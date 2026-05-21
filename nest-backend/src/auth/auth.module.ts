import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "src/constants/auth.constants";
import { MailModule } from "src/mail/mail.module";
import { StaffModule } from "src/staff/staff.module";
import { AuthController } from "./auth.controller";
import { StaffService } from "src/staff/staff.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Staff, StaffSchema } from "src/staff/staff.schema";
import { ResetPassword, ResetPasswordSchema } from "src/reset-password/reset-password.schema";
import { UploadModule } from "src/upload/upload.module";
import { ExceptionManager } from "src/manager/exception.manager";
import { ResponseManager } from "src/manager/response.manager";
import { Country, CountrySchema } from "src/country/country.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Staff.name, schema: StaffSchema },
            { name: ResetPassword.name, schema: ResetPasswordSchema},
            { name: Country.name, schema: CountrySchema }
        ]),
        UploadModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '30d' }
        }),
        MailModule
    ],
    controllers: [AuthController],
    providers: [StaffService, ExceptionManager, ResponseManager]
})
export class AuthModule {}