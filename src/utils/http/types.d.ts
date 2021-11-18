import Axios, {
  AxiosRequestConfig,
  Canceler,
  AxiosResponse,
  Method,
  AxiosError
} from "axios";

import { METHODS } from "./config";

export type cancelTokenType = { cancelKey: string; cancelExecutor: Canceler };

// 提取共有的字段
export type RequestMethods = Extract<
  Method,
  "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface EnclosureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: EnclosureHttpRequestConfig) => void; // 请求发送之前
  beforeResponseCallback?: (response: EnclosureHttpResoponse) => void; // 应返回之前
}

export interface EnclosureHttpResoponse extends AxiosResponse {
  config: EnclosureHttpRequestConfig;
}

export interface EnclosureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}
