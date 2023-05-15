import { HttpStatus } from '@nestjs/common';
import { ResponseDTO } from 'src/app/response.dto';

export class ResponseManager<T> {
  async getResponse(
    data: T,
    message: string,
    statusCode: number = HttpStatus.OK,
    success = true,
    validationErrors = []
  ): Promise<ResponseDTO<T>> {
    const response: ResponseDTO<T> = {
      success: success,
      data: data,
      message: message,
      statusCode: statusCode,
      validation_errors: validationErrors
    };
    return response;
  }
}
