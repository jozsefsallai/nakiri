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

export class ChannelIDsAPIService {
  static GET_CHANNEL_IDS_URL = '/api/lists/youtube/channels?compact=false';

  static ADD_CHANNEL_ID_URL = '/api/lists/youtube/channels';
  static ADD_CHANNEL_ID_WITH_GUILD_URL = '/api/lists/youtube/channels?guild=:guild';

  public async getChannelIDs(): Promise<GetChannelIDsAPIResponse> {
    return axiosService.get(ChannelIDsAPIService.GET_CHANNEL_IDS_URL)
      .then(res => res.data);
  }

  public async addChannelID({ channelID, guild }: AddChannelIDAPIRequest): Promise<AddChannelIDAPIResponse> {
    const url = this.makeAddChannelIDUrl(guild);
    return axiosService.post(url, { channelID }).then(res => res.data);
  }

  private makeAddChannelIDUrl(guild?: string): string {
    if (guild) {
      return ChannelIDsAPIService.ADD_CHANNEL_ID_WITH_GUILD_URL.replace(':guild', guild);
    }

    return ChannelIDsAPIService.ADD_CHANNEL_ID_URL;
  }
}
