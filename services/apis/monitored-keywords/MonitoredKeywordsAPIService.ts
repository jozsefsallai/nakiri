import axiosService, { APIResponse } from '@/services/axios';

import { IMonitoredKeyword } from '@/db/models/keywords/MonitoredKeyword';

export interface GetMonitoredKeywordsAPIResponse extends APIResponse {
  entries: IMonitoredKeyword[];
}

export interface CreateMonitoredKeywordAPIRequest {
  keyword: string;
  guildId: string;
  webhookUrl: string;
}

export interface CreateMonitoredKeywordAPIResponse extends APIResponse {}

export interface GetMonitoredKeywordAPIResponse extends APIResponse {
  entry: IMonitoredKeyword;
}

export interface UpdateMonitoredKeywordAPIRequest {
  keyword?: string;
  guildId?: string;
  webhookUrl?: string;
}

export interface UpdateMonitoredKeywordAPIResponse extends APIResponse {}

export interface DeleteMonitoredKeywordAPIResponse extends APIResponse {}

export class MonitoredKeywordsAPIService {
  static GET_MONITORED_KEYWORDS_API_URL =
    '/api/monitored-keywords/guild/:guild';
  static CREATE_MONITORED_KEYWORD_API_URL = '/api/monitored-keywords';
  static GET_MONITORED_KEYWORD_API_URL = '/api/monitored-keywords/:id';
  static UPDATE_MONITORED_KEYWORD_API_URL = '/api/monitored-keywords/:id';
  static DELETE_MONITORED_KEYWORD_API_URL = '/api/monitored-keywords/:id';

  public async getMonitoredKeywords(
    guild: string,
  ): Promise<GetMonitoredKeywordsAPIResponse> {
    const url = this.makeGetMonitoredKeywordsUrl(guild);
    return axiosService.get(url).then((res) => res.data);
  }

  public async createMonitoredKeyword({
    keyword,
    guildId,
    webhookUrl,
  }: CreateMonitoredKeywordAPIRequest): Promise<CreateMonitoredKeywordAPIResponse> {
    return axiosService
      .post(MonitoredKeywordsAPIService.CREATE_MONITORED_KEYWORD_API_URL, {
        keyword,
        guildId,
        webhookUrl,
      })
      .then((res) => res.data);
  }

  public async getMonitoredKeyword(
    id: string,
  ): Promise<GetMonitoredKeywordAPIResponse> {
    const url = this.makeGetMonitoredKeywordUrl(id);
    return axiosService.get(url).then((res) => res.data);
  }

  public async updateMonitoredKeyword(
    id: string,
    { keyword, guildId, webhookUrl }: UpdateMonitoredKeywordAPIRequest,
  ): Promise<UpdateMonitoredKeywordAPIResponse> {
    const url = this.makeUpdateMonitoredKeywordUrl(id);
    return axiosService
      .patch(url, {
        keyword,
        guildId,
        webhookUrl,
      })
      .then((res) => res.data);
  }

  public async deleteMonitoredKeyword(
    id: string,
  ): Promise<DeleteMonitoredKeywordAPIResponse> {
    const url = this.makeDeleteMonitoredKeywordUrl(id);
    return axiosService.delete(url).then((res) => res.data);
  }

  private makeGetMonitoredKeywordsUrl(guildId: string): string {
    return MonitoredKeywordsAPIService.GET_MONITORED_KEYWORDS_API_URL.replace(
      ':guild',
      guildId,
    );
  }

  private makeGetMonitoredKeywordUrl(id: string): string {
    return MonitoredKeywordsAPIService.GET_MONITORED_KEYWORD_API_URL.replace(
      ':id',
      id,
    );
  }

  private makeUpdateMonitoredKeywordUrl(id: string): string {
    return MonitoredKeywordsAPIService.UPDATE_MONITORED_KEYWORD_API_URL.replace(
      ':id',
      id,
    );
  }

  private makeDeleteMonitoredKeywordUrl(id: string): string {
    return MonitoredKeywordsAPIService.DELETE_MONITORED_KEYWORD_API_URL.replace(
      ':id',
      id,
    );
  }
}
