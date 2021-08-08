import axiosService, { APIResponse } from '@/services/axios';

import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';

export interface GetLinkPatternsAPIRequest {
  guild?: string;
  page?: number;
  limit?: number;
};

export interface GetLinkPatternsAPIResponse extends APIResponse {
  patterns: ILinkPattern[];
};

export interface AddLinkPatternAPIRequest {
  pattern: string;
  guild?: string;
};

export interface AddLinkPatternAPIResponse extends APIResponse {
};

export interface DeleteLinkPatternAPIResponse extends APIResponse {
};

export class LinkPatternsAPIService {
  static GET_LINK_PATTERNS_URL = '/api/lists/link-patterns?compact=false&page=:page&limit=:limit';
  static GET_LINK_PATTERNS_WITH_GUILD_URL = '/api/lists/link-patterns?compact=false&guild=:guild&strict=true&page=:page&limit=:limit';

  static ADD_LINK_PATTERN_URL = '/api/lists/link-patterns';
  static ADD_LINK_PATTERN_WITH_GUILD_URL = '/api/lists/link-patterns?guild=:guild';

  static DELETE_LINK_PATTERN_URL = '/api/lists/link-patterns/:id';

  public async getLinkPatterns({ guild, page, limit }: GetLinkPatternsAPIRequest): Promise<GetLinkPatternsAPIResponse> {
    const url = this.makeGetLinkPatternsUrl(guild, page, limit);
    return axiosService.get(url).then(res => res.data);
  }

  public async addLinkPattern({ pattern, guild }: AddLinkPatternAPIRequest): Promise<AddLinkPatternAPIResponse> {
    const url = this.makeAddLinkPatternUrl(guild);
    return axiosService.post(url, { pattern }).then(res => res.data);
  }

  public async deleteLinkPattern(id: string): Promise<DeleteLinkPatternAPIResponse> {
    const url = this.makeDeleteLinkPatternUrl(id);
    return axiosService.delete(url).then(res => res.data);
  }

  private makeGetLinkPatternsUrl(guild?: string, page?: number, limit?: number): string {
    const url = guild
      ? LinkPatternsAPIService.GET_LINK_PATTERNS_WITH_GUILD_URL.replace(':guild', guild)
      : LinkPatternsAPIService.GET_LINK_PATTERNS_URL;

    return url
      .replace(':page', (page ?? 1).toString())
      .replace(':limit', (limit ?? 25).toString());
  }

  private makeAddLinkPatternUrl(guild?: string): string {
    if (guild) {
      return LinkPatternsAPIService.ADD_LINK_PATTERN_WITH_GUILD_URL.replace(':guild', guild);
    }

    return LinkPatternsAPIService.ADD_LINK_PATTERN_URL;
  }

  private makeDeleteLinkPatternUrl(id: string): string {
    return LinkPatternsAPIService.DELETE_LINK_PATTERN_URL.replace(':id', id);
  }
}
