import axiosService, { APIResponse } from '@/services/axios';

import { IYouTubeChannelID } from '@/db/models/blacklists/YouTubeChannelID';
import { isRendered } from 'nprogress';

export interface GetChannelIDsAPIRequest {
  group?: string;
  guild?: string;
  page?: number;
  limit?: number;
}

export interface GetChannelIDsAPIResponse extends APIResponse {
  channelIDs: IYouTubeChannelID[];
}

export interface AddChannelIDAPIRequest {
  channelID: string;
  guild?: string;
  group?: string;
  severity?: number;
}

export interface AddChannelIDAPIResponse extends APIResponse {}

export interface DeleteChannelIDAPIResponse extends APIResponse {}

export class ChannelIDsAPIService {
  static GET_CHANNEL_IDS_URL =
    '/api/lists/youtube/channels?compact=false&page=:page&limit=:limit';
  static GET_CHANNEL_IDS_WITH_GROUP_URL =
    '/api/lists/youtube/channels?compact=false&group=:group&strict=true&page=:page&limit=:limit';
  static GET_CHANNEL_IDS_WITH_GUILD_URL =
    '/api/lists/youtube/channels?compact=false&group=:group&guild=:guild&strict=true&page=:page&limit=:limit';

  static ADD_CHANNEL_ID_URL = '/api/lists/youtube/channels';
  static ADD_CHANNEL_ID_WITH_GROUP_URL =
    '/api/lists/youtube/channels?group=:group';
  static ADD_CHANNEL_ID_WITH_GUILD_URL =
    '/api/lists/youtube/channels?group=:group&guild=:guild';

  static DELETE_CHANNEL_ID_URL = '/api/lists/youtube/channels/:id';

  public async getChannelIDs({
    group,
    guild,
    page,
    limit,
  }: GetChannelIDsAPIRequest): Promise<GetChannelIDsAPIResponse> {
    const url = this.makeGetChannelIDsUrl(group, guild, page, limit);
    return axiosService.get(url).then((res) => res.data);
  }

  public async addChannelID({
    channelID,
    guild,
    group,
    severity,
  }: AddChannelIDAPIRequest): Promise<AddChannelIDAPIResponse> {
    const url = this.makeAddChannelIDUrl(group, guild);
    return axiosService
      .post(url, { channelID, severity })
      .then((res) => res.data);
  }

  public async deleteChannelID(
    id: string,
  ): Promise<DeleteChannelIDAPIResponse> {
    const url = this.makeDeleteChannelIDUrl(id);
    return axiosService.delete(url).then((res) => res.data);
  }

  private makeGetChannelIDsUrl(
    group?: string,
    guild?: string,
    page?: number,
    limit?: number,
  ): string {
    let url: string;

    if (group) {
      url = guild
        ? ChannelIDsAPIService.GET_CHANNEL_IDS_WITH_GUILD_URL.replace(
            ':group',
            group,
          ).replace(':guild', guild)
        : ChannelIDsAPIService.GET_CHANNEL_IDS_WITH_GROUP_URL.replace(
            ':group',
            group,
          );
    } else {
      url = ChannelIDsAPIService.GET_CHANNEL_IDS_URL;
    }

    return url
      .replace(':page', (page ?? 1).toString())
      .replace(':limit', (limit ?? 25).toString());
  }

  private makeAddChannelIDUrl(group?: string, guild?: string): string {
    if (group) {
      return guild
        ? ChannelIDsAPIService.ADD_CHANNEL_ID_WITH_GUILD_URL.replace(
            ':group',
            group,
          ).replace(':guild', guild)
        : ChannelIDsAPIService.ADD_CHANNEL_ID_WITH_GROUP_URL.replace(
            ':group',
            group,
          );
    } else {
      return ChannelIDsAPIService.ADD_CHANNEL_ID_URL;
    }
  }

  private makeDeleteChannelIDUrl(id: string): string {
    return ChannelIDsAPIService.DELETE_CHANNEL_ID_URL.replace(':id', id);
  }
}
