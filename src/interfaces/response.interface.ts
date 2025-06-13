export interface IResponseGeneric {
  success: boolean;
  message: string;
}

export interface IResponseError {
  status: number;
  success: false;
  message: string;
}
