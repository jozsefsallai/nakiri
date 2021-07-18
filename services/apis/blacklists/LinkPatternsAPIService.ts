import axiosService, { APIResponse } from '@/services/axios';

import { ILinkPattern } from '@/db/models/blacklists/LinkPattern';

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
  static GET_LINK_PATTERNS_URL = '/api/lists/link-patterns?compact=false';
  static GET_LINK_PATTERNS_WITH_GUILD_URL = '/api/lists/link-patterns?compact=false&guild=:guild&strict=true';

  static ADD_LINK_PATTERN_URL = '/api/lists/link-patterns';
  static ADD_LINK_PATTERN_WITH_GUILD_URL = '/api/lists/link-patterns?guild=:guild';

  static DELETE_LINK_PATTERN_URL = '/api/lists/link-patterns/:id';

  public async getLinkPatterns(guild?: string): Promise<GetLinkPatternsAPIResponse> {
    const url = this.makeGetLinkPatternsUrl(guild);
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

  private makeGetLinkPatternsUrl(guild?: string): string {
    if (guild) {
      return LinkPatternsAPIService.GET_LINK_PATTERNS_WITH_GUILD_URL.replace(':guild', guild);
    }

    return LinkPatternsAPIService.GET_LINK_PATTERNS_URL;
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
