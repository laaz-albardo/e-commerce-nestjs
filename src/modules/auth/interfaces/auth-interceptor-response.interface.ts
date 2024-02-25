export interface IAuhtInterceptorResponse<T> {
  statusCode: number;
  msg: string;
  data: T;
}
