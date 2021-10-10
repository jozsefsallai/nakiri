import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { IGuild, IGuildWithKey } from '@/controllers/guilds/IGuild';

export interface GetGuildsAPIResponse extends APIResponse {
  guilds: IGuildWithKey[];
}

export interface GetAllGuildsAPIResponse extends APIResponse {
  guilds: IGuild[];
}

export interface AddNewGuildAPIResponse extends APIResponse {
  key: string;
}

export class GuildsAPIService {
  static GET_GUILDS_URL = '/api/guilds';
  static GET_GUILDS_WITHOUT_CACHE_URL = '/api/guilds?skipCache=true';
  static GET_ALL_GUILDS_URL = '/api/guilds/all';

  static ADD_NEW_GUILD_URL = '/api/guilds';

  public async getGuilds(skipCache?: boolean): Promise<GetGuildsAPIResponse> {
    return axiosService
      .get(this.makeGetGuildsUrl(skipCache))
      .then((res) => res.data);
  }

  public async getAllGuilds(): Promise<GetAllGuildsAPIResponse> {
    return axiosService
      .get(GuildsAPIService.GET_ALL_GUILDS_URL)
      .then((res) => res.data);
  }

  public async addNewGuild(guildId: string): Promise<AddNewGuildAPIResponse> {
    return axiosService
      .post(GuildsAPIService.ADD_NEW_GUILD_URL, { guildId })
      .then((res) => res.data);
  }

  private makeGetGuildsUrl(skipCache?: boolean): string {
    return skipCache
      ? GuildsAPIService.GET_GUILDS_WITHOUT_CACHE_URL
      : GuildsAPIService.GET_GUILDS_URL;
  }
}
