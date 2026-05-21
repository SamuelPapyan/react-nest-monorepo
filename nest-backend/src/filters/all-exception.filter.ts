import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { IResponse } from 'src/interfaces/response.interface';
import { ExceptionManager } from 'src/manager/exception.manager';
import { ResponseManager } from 'src/manager/response.manager';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly exceptionManager: ExceptionManager,
    private readonly responseManager: ResponseManager,
  ) {}
  async catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = this.exceptionManager.isInException(exception)
      ? exception.getStatus()
      : HttpStatus.BAD_REQUEST;
    const responseBody: IResponse =
      await this.responseManager.getResponse(
        null,
        !(exception.message instanceof Array)
          ? exception.message
          : exception.error,
        httpStatus,
        false,
        exception.message instanceof Array
          ? exception.message
          : [],
      );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
