import buildUrl from '@/lib/buildUrl';

import { AxiosRequestConfig, AxiosResponse, default as axios } from 'axios';
import NProgress from 'nprogress';

export interface APIPaginationData {
  page: number;
  limit: number;
  pageCount: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface APIResponse {
  ok: boolean;
  pagination?: APIPaginationData;
}

export interface APIErrorResponse extends APIResponse {
  error?: string;
  details?: {
    [key: string]: any;
  };
}

axios.interceptors.request.use(
  (req) => {
    if (typeof window !== 'undefined' && !['get', 'GET'].includes(req.method)) {
      NProgress.start();
    }

    return req;
  },
  (err) => {
    if (typeof window !== 'undefined') {
      NProgress.done();
    }

    return Promise.reject(err);
  },
);

axios.interceptors.response.use(
  (res) => {
    if (typeof window !== 'undefined') {
      NProgress.done();
    }

    return res;
  },
  (err) => {
    if (typeof window !== 'undefined') {
      NProgress.done();
    }

    return Promise.reject(err);
  },
);

class AxiosService {
  public async get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.get(requestUrl, config);
  }

  public async post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.post(requestUrl, data, config);
  }

  public async put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.put(requestUrl, data, config);
  }

  public async patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.patch(requestUrl, data, config);
  }

  public async delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    const requestUrl: string = buildUrl(url);
    return axios.delete(requestUrl, config);
  }
}

const axiosService = new AxiosService();
export default axiosService;
