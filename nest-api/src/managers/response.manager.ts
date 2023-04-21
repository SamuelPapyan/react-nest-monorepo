import { HttpStatus } from '@nestjs/common';
import { ResponseDTO } from 'src/dto/response.dto';

export class ResponseManager<T> {
  async getResponse(
    data: T,
    message: string,
    statusCode: number = HttpStatus.OK,
    success = true,
  ): Promise<ResponseDTO<T>> {
    const response: ResponseDTO<T> = {
      success: success,
      data: data,
      message: message,
      statusCode: statusCode,
    };
    return response;
  }
}
