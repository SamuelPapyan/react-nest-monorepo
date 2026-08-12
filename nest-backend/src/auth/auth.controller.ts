import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseFilters, UseGuards } from "@nestjs/common";
import { UserType } from "src/enums/user-type.enum";
import { AllExceptionFilter } from "src/filters/all-exception.filter";
import { AuthGuard } from "src/guards/auth.guard";
import { IResponse } from "src/interfaces/response.interface";
import { MailService } from "src/mail/mail.service";
import { ExceptionManager } from "src/manager/exception.manager";
import { ResponseManager } from "src/manager/response.manager";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly responseManager: ResponseManager,
        private readonly exceptionManager: ExceptionManager,
        private mailService: MailService,
    ) {}

    @Post('send_mail')
    @UseFilters(AllExceptionFilter)
    async sendPasswordRecovery(
        @Body() body: Record<string, any>
    ): Promise<IResponse | undefined> {
        try {
            const data = await this.mailService.sendPasswordRecovery(
                body.email,
                UserType.STAFF
            );
            return this.responseManager.getResponse(
                data,
                'EMAIL_SENT'
            );
        } catch (e) {
            this.exceptionManager.throwException(e);
        }
    }

    
}