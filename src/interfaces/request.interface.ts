import type { AxiosRequestConfig } from 'axios';

export interface IRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}
