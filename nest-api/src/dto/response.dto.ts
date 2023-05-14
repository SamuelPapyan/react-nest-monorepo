import { ValidationErrorDTO } from "./validation-error.dto";

export interface ResponseDTO<T> {
  success: boolean;
  data: T;
  message: string;
  validation_errors: ValidationErrorDTO[];
  statusCode: number;
}
