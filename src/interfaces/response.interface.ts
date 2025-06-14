export interface IResponseGeneric {
  success: boolean;
  message: string;
  pagination?: IPagination;
}

export interface IResponseError {
  status: number;
  success: false;
  message: string;
}

export interface IPagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
}
