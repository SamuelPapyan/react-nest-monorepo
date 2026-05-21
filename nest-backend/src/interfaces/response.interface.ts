import { IValidationError } from "./validation-error.interface";

export interface IResponse {
  success: boolean;
  data: any;
  message: string;
  validation_errors: IValidationError[];
  statusCode: number;
}
