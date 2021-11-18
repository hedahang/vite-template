import Axios, {
  AxiosRequestConfig,
  CancelTokenStatic,
  AxiosInstance
} from "axios";

import NProgress from "../progress";

import { genConfig } from "./config";

import {
  cancelTokenType,
  RequestMethods,
  EnclosureHttpRequestConfig,
  EnclosureHttpResoponse,
  EnclosureHttpError
} from "./types.d";
import { transformConfigByMethod } from "./utils";

class EnclosureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  // 初始化配置对象
  private static initConfig: EnclosureHttpRequestConfig = {};

  // 保存当前Axios实例对象
  private static axiosInstance: AxiosInstance = Axios.create(genConfig());

  /**
   * @description 拦截请求
   * @returns void 0
   */

  private httpInterceptorsRequest(): void {
    EnclosureHttp.axiosInstance.interceptors.request.use(
      (config: EnclosureHttpRequestConfig) => {
        const $config = config;
        NProgress.start(); // 每次切换页面时，调用进度条
        console.log($config);
        return $config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
  /**
   * @description 拦截响应
   * @returns void 0
   */
  private httpInterceptorsResponse(): void {
    const instance = EnclosureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: EnclosureHttpResoponse) => {
        console.log(response);
        const $config = response.config;

        NProgress.done();

        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (EnclosureHttp.initConfig.beforeResponseCallback) {
          EnclosureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: EnclosureHttpError) => {
        const $error = error;
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }
  public request<T>(
    method: RequestMethods,
    url: string,
    param: AxiosRequestConfig,
    axiosConfig?: EnclosureHttpRequestConfig
  ): Promise<T> {
    const config = transformConfigByMethod(param, {
      method,
      url,
      ...axiosConfig
    } as EnclosureHttpRequestConfig);
    return new Promise((resolve, reject) => {
      EnclosureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}
export default EnclosureHttp;
