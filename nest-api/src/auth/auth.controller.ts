import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ResponseDTO } from 'src/app/response.dto';
import { ResponseManager } from 'src/app/managers/response.manager';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { UsersService } from 'src/users/users.service';
import { UserDTO } from 'src/users/user.dto';
import { AllExceptionFilter } from 'src/app/all-exception.filter';
import { MailService } from 'src/mail/mail.service';
import mongoose from 'mongoose';
import { ResetPassword } from 'src/mail/reset_password.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private readonly responseManager: ResponseManager<any>,
    private readonly exceptionManager: ExceptionManager,
    private readonly mailService: MailService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
  ): Promise<ResponseDTO<any>> {
    try {
      const payload = await this.authService.signIn(
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

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<ResponseDTO<any>> {
    return this.responseManager.getResponse(req.user, 'Profile got successful');
  }

  @Post('signup')
  @UseFilters(AllExceptionFilter)
  async signUp(@Body() signUpDto: UserDTO): Promise<ResponseDTO<UserDTO>> {
    try {
      const user = await this.userService.addUser(signUpDto, null);
      return this.responseManager.getResponse(user, 'USER_ADDED');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Post('send_mail')
  @UseFilters(AllExceptionFilter)
  async sendPasswordRecovery(
    @Body() body: Record<string, any>,
  ): Promise<ResponseDTO<ResetPassword>> {
    try {
      const data = await this.mailService.sendPasswordRecovery(
        body.email,
        'user',
      );
      return new ResponseManager<ResetPassword>().getResponse(
        data,
        'EMAIL_SENT',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Get('reset/validate/:id')
  @UseFilters(AllExceptionFilter)
  async validateResetLink(@Param('id') id: string): Promise<ResponseDTO<any>> {
    try {
      const data = await this.userService.getResetPasswordDto(id);
      let bool = true;
      if (!data || data.is_used || data.expiration_date < Date.now())
        bool = false;
      return new ResponseManager<any>().getResponse(
        { user_id: data.user_id, isValid: bool },
        'VALIDATION',
      );
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }

  @Put('reset/:id')
  @UseFilters(AllExceptionFilter)
  async resetPassword(
    @Param('id') id: string,
    @Body() body: Record<string, any>,
  ): Promise<ResponseDTO<UserDTO>> {
    try {
      const mongoId = new mongoose.Types.ObjectId(id);
      const user = await this.userService.resetPassword(mongoId, body.password);
      return this.responseManager.getResponse(user, 'PASSWORD_RESET');
    } catch (e) {
      this.exceptionManager.throwException(e);
    }
  }
}
