export interface IBaseResponse {
  statusCode: number;
  data?: object | [] | null;
  paginateParams?: object | null;
  msg: string;
  errors?: string | object | [] | null;
}
