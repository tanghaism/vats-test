export declare module 'axios' {
  import { AxiosRequestConfig, AxiosResponse } from 'axios';

  export interface AxiosRequestConfig {
    hideError?: boolean;
  }

  export interface CustomerAxiosResponse extends AxiosResponse {
    config: AxiosRequestConfig;
  }
}
