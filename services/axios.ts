import buildUrl from '@/lib/buildUrl';

import { Response, Options, default as redaxios } from 'redaxios';
import NProgress from 'nprogress';

type RequestMethod =
  | 'get'
  | 'GET'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'options'
  | 'head'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD';

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

class AxiosService {
  private async perform<T = any>(
    method: RequestMethod,
    url: string,
    data?: any,
    options?: Options,
  ): Promise<Response<T>> {
    try {
      if (typeof window !== 'undefined' && !['get', 'GET'].includes(method)) {
        NProgress.start();
      }

      const requestUrl: string = buildUrl(url);
      const response = await redaxios<T>(requestUrl, options, method, data);

      if (typeof window !== 'undefined') {
        NProgress.done();
      }

      return response;
    } catch (err) {
      if (typeof window !== 'undefined') {
        NProgress.done();
      }

      return Promise.reject(err);
    }
  }

  public async get<T = any>(
    url: string,
    options?: Options,
  ): Promise<Response<T>> {
    return this.perform<T>('get', url, undefined, options);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    options?: Options,
  ): Promise<Response<T>> {
    return this.perform<T>('post', url, data, options);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    options?: Options,
  ): Promise<Response<T>> {
    return this.perform<T>('put', url, data, options);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    options?: Options,
  ): Promise<Response<T>> {
    return this.perform<T>('patch', url, data, options);
  }

  public async delete<T = any>(
    url: string,
    options?: Options,
  ): Promise<Response<T>> {
    return this.perform<T>('delete', url, undefined, options);
  }
}

const axiosService = new AxiosService();
export default axiosService;
