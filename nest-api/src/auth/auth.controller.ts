import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ResponseDTO } from 'src/app/response.dto';
import { ResponseManager } from 'src/app/managers/response.manager';
import { ExceptionManager } from 'src/app/managers/exception.manager';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly responseManager: ResponseManager<any>,
    private readonly exceptionManager: ExceptionManager,
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
}
