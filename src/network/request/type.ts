import type {AxiosRequestConfig, AxiosResponse} from "axios";

interface LzAxiosInterceptor<T = AxiosResponse> {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorCatch?: (err: any) => any;
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (err: any) => any;
}

interface LzAxiosConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: LzAxiosInterceptor<T>;
}

export type {LzAxiosInterceptor, LzAxiosConfig};
