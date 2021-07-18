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

export class LinkPatternsAPIService {
  static GET_LINK_PATTERNS_URL = '/api/lists/link-patterns?compact=false';

  static ADD_LINK_PATTERN_URL = '/api/lists/link-patterns';
  static ADD_LINK_PATTERN_WITH_GUILD_URL = '/api/lists/link-patterns?guild=:guild';

  public async getLinkPatterns(): Promise<GetLinkPatternsAPIResponse> {
    return axiosService.get(LinkPatternsAPIService.GET_LINK_PATTERNS_URL)
      .then(res => res.data);
  }

  public async addLinkPattern({ pattern, guild }: AddLinkPatternAPIRequest): Promise<AddLinkPatternAPIResponse> {
    const url = this.makeAddLinkPatternUrl(guild);
    return axiosService.post(url, { pattern }).then(res => res.data);
  }

  private makeAddLinkPatternUrl(guild?: string): string {
    if (guild) {
      return LinkPatternsAPIService.ADD_LINK_PATTERN_WITH_GUILD_URL.replace(':guild', guild);
    }

    return LinkPatternsAPIService.ADD_LINK_PATTERN_URL;
  }
}
