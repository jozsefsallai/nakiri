import axiosService, { APIResponse } from '@/services/axios';

import { IKeywordWhitelistedChannel } from '@/db/models/keywords/KeywordWhitelistedChannel';

export interface GetKeywordWhitelistedChannelsAPIResponse extends APIResponse {
  channels: IKeywordWhitelistedChannel[];
};

export interface AddKeywordWhitelistedChannelAPIRequest {
  guildId: string;
  channelId: string;
};

export interface AddKeywordWhitelistedChannelAPIResponse extends APIResponse {};

export interface DeleteKeywordWhitelistedChannelAPIResponse extends APIResponse {};

export class KeywordWhitelistedChannelsAPIService {
  static GET_WHITELISTED_CHANNELS_API_URL = '/api/monitored-keywords/guild/:guild/whitelisted-channels';
  static ADD_WHITELISTED_CHANNEL_API_URL = '/api/monitored-keywords/guild/:guild/whitelisted-channels';
  static DELETE_WHITELISTED_CHANNEL_API_URL = '/api/monitored-keywords/guild/:guild/whitelisted-channels/:id';

  public async getWhitelistedChannels(guildId: string): Promise<GetKeywordWhitelistedChannelsAPIResponse> {
    const url = this.makeGetWhitelistedChannelsAPIURL(guildId);
    return await axiosService.get(url).then(res => res.data);
  }

  public async addWhitelistedChannel({ guildId, channelId }: AddKeywordWhitelistedChannelAPIRequest): Promise<AddKeywordWhitelistedChannelAPIResponse> {
    const url = this.makeAddWhitelistedChannelAPIURL(guildId);
    return axiosService.post(url, { channelId }).then(res => res.data);
  }

  public async deleteWhitelistedChannel(guildId: string, id: string): Promise<DeleteKeywordWhitelistedChannelAPIResponse> {
    const url = this.makeDeleteWhitelistedChannelAPIURL(guildId, id);
    return await axiosService.delete(url).then(res => res.data);
  }

  private makeGetWhitelistedChannelsAPIURL(guild: string): string {
    return KeywordWhitelistedChannelsAPIService.GET_WHITELISTED_CHANNELS_API_URL
      .replace(':guild', guild);
  }

  private makeAddWhitelistedChannelAPIURL(guild: string): string {
    return KeywordWhitelistedChannelsAPIService.ADD_WHITELISTED_CHANNEL_API_URL
      .replace(':guild', guild);
  }

  private makeDeleteWhitelistedChannelAPIURL(guild: string, id: string): string {
    return KeywordWhitelistedChannelsAPIService.DELETE_WHITELISTED_CHANNEL_API_URL
      .replace(':guild', guild)
      .replace(':id', id);
  }
}
