import axiosService, { APIResponse } from '@/services/axios';

import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';

export interface GetChannelIDsAPIResponse extends APIResponse {
  channelIDs: IYouTubeChannelID[];
};

export interface AddChannelIDAPIRequest {
  channelID: string;
  guild?: string;
};

export interface AddChannelIDAPIResponse extends APIResponse {
};

export interface DeleteChannelIDAPIResponse extends APIResponse {
};

export class ChannelIDsAPIService {
  static GET_CHANNEL_IDS_URL = '/api/lists/youtube/channels?compact=false';
  static GET_CHANNEL_IDS_WITH_GUILD_URL = '/api/lists/youtube/channels?compact=false&guild=:guild&strict=true';

  static ADD_CHANNEL_ID_URL = '/api/lists/youtube/channels';
  static ADD_CHANNEL_ID_WITH_GUILD_URL = '/api/lists/youtube/channels?guild=:guild';

  static DELETE_CHANNEL_ID_URL = '/api/lists/youtube/channels/:id';

  public async getChannelIDs(guild?: string): Promise<GetChannelIDsAPIResponse> {
    const url = this.makeGetChannelIDsUrl(guild);
    return axiosService.get(url).then(res => res.data);
  }

  public async addChannelID({ channelID, guild }: AddChannelIDAPIRequest): Promise<AddChannelIDAPIResponse> {
    const url = this.makeAddChannelIDUrl(guild);
    return axiosService.post(url, { channelID }).then(res => res.data);
  }

  public async deleteChannelID(id: string): Promise<DeleteChannelIDAPIResponse> {
    const url = this.makeDeleteChannelIDUrl(id);
    return axiosService.delete(url).then(res => res.data);
  }

  private makeGetChannelIDsUrl(guild?: string): string {
    if (guild) {
      return ChannelIDsAPIService.GET_CHANNEL_IDS_WITH_GUILD_URL.replace(':guild', guild);
    }

    return ChannelIDsAPIService.GET_CHANNEL_IDS_URL;
  }

  private makeAddChannelIDUrl(guild?: string): string {
    if (guild) {
      return ChannelIDsAPIService.ADD_CHANNEL_ID_WITH_GUILD_URL.replace(':guild', guild);
    }

    return ChannelIDsAPIService.ADD_CHANNEL_ID_URL;
  }

  private makeDeleteChannelIDUrl(id: string): string {
    return ChannelIDsAPIService.DELETE_CHANNEL_ID_URL.replace(':id', id);
  }
}
