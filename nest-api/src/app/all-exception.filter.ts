import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseDTO } from 'src/app/response.dto';
import { ValidationErrorDTO } from 'src/app/validation-error.dto';
import { ExceptionManager } from 'src/app/managers/exception.manager';
import { ResponseManager } from 'src/app/managers/response.manager';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly exceptionManager: ExceptionManager,
    private readonly responseManager: ResponseManager<null>,
  ) {}
  async catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = this.exceptionManager.isInException(exception)
      ? exception.getStatus()
      : HttpStatus.BAD_REQUEST;
    const responseBody: ResponseDTO<null> =
      await this.responseManager.getResponse(
        null,
        !(exception.response.message instanceof Array) ? exception.response.message : exception.response.error,
        httpStatus,
        false,
        (exception.response.message instanceof Array) ? exception.response.message : []
      );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
