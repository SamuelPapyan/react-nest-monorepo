export interface ResponseDTO<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}
