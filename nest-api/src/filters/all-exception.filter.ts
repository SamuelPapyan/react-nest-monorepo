import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseDTO } from 'src/dto/response.dto';
import { ExceptionManager } from 'src/managers/exception.manager';
import { ResponseManager } from 'src/managers/response.manager';

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
        exception.message,
        httpStatus,
        false,
      );

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
