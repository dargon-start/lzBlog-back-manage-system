import axios from "axios";
import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {LzAxiosInterceptor, LzAxiosConfig} from "./type";
import {ElLoading,ElMessage } from "element-plus";
class LzRequest {
  instance: AxiosInstance;
  interceptors?: LzAxiosInterceptor;
  loading: any;
  constructor(config: LzAxiosConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;
    //实例拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );
    //公共拦截器
    this.instance.interceptors.request.use(
      (config) => {
        this.loading = ElLoading.service({
          lock: true,
          text: "加载中...",
          background: "rgba(0, 0, 0, 0.7)",
        });
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        console.log("全局");
        this.loading.close();
        return res.data;
      },

      (err) => {
        this.loading.close();
        console.log(err);

        ElMessage({
          message: err.response.data,
          type: 'error',
        })
        if (err.response.status === 401) {
          console.log(1111111);
          location.href = location.origin + "/login";
        }
        return Promise.reject(err);
      }
    );
  }
  //重写request方法
  request<T = any>(config: LzAxiosConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      //如果有请求拦截器，执行请求拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors?.requestInterceptor(config);
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors?.responseInterceptor(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "GET",
    });
  }
  post<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "POST",
    });
  }
  patch<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "PATCH",
    });
  }
  delete<T = any>(config: LzAxiosConfig<T>) {
    return this.request<T>({
      ...config,
      method: "DELETE",
    });
  }
}

export default LzRequest;
