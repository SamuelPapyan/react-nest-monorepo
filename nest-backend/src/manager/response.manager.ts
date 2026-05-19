import { HttpStatus } from '@nestjs/common';
import { IResponse } from 'src/interfaces/response.interface';

export class ResponseManager {
  async getResponse(
    data: any,
    message: string,
    statusCode: number = HttpStatus.OK,
    success = true,
    validationErrors = []
  ): Promise<IResponse> {
    const response: IResponse = {
      success,
      data,
      message,
      statusCode,
      validation_errors: validationErrors
    };
    return response;
  }
}
