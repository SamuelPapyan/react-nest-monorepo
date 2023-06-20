import { BadRequestException, NotFoundException } from '@nestjs/common';

export class ExceptionManager {
  throwException(exception: any) {
    if (this.isInException(exception)) {
      throw exception;
    }
    throw new BadRequestException(exception.message);
  }

  isInException(exception: any): boolean {
    const exceptions: boolean[] = [];
    exceptions.push(exception instanceof NotFoundException);
    return exceptions.some((value) => value);
  }
}
