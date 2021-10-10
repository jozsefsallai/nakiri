import axiosService, { APIResponse } from '@/services/axios';

import { IDiscordGuild } from '@/db/models/blacklists/DiscordGuild';

export interface GetDiscordGuildsAPIRequest {
  group?: string;
  guild?: string;
  page?: number;
  limit?: number;
}

export interface GetDiscordGuildsAPIResponse extends APIResponse {
  discordGuilds: IDiscordGuild[];
}

export interface AddDiscordGuildAPIRequest {
  id: string;
  name?: string;
  guild?: string;
}

export interface AddDiscordGuildAPIResponse extends APIResponse {}

export interface DeleteDiscordGuildAPIResponse extends APIResponse {}

export class DiscordGuildsAPIService {
  static GET_DISCORD_GUILDS_URL =
    '/api/lists/discord?compact=false&page=:page&limit=:limit';
  static GET_DISCORD_GUILDS_WITH_GROUP_URL =
    '/api/lists/discord?compact=false&group=:group&strict=true&page=:page&limit=:limit';
  static GET_DISCORD_GUILDS_WITH_GUILD_URL =
    '/api/lists/discord?compact=false&group=:group&guild=:guild&strict=true&page=:page&limit=:limit';

  static ADD_DISCORD_GUILD_URL = '/api/lists/discord';
  static ADD_DISCORD_GUILD_WITH_GUILD_URL = '/api/lists/discord?guild=:guild';

  static DELETE_DISCORD_GUILD_URL = '/api/lists/discord/:id';

  public async getDiscordGuilds({
    group,
    guild,
    page,
    limit,
  }: GetDiscordGuildsAPIRequest): Promise<GetDiscordGuildsAPIResponse> {
    const url = this.makeGetDiscordGuildsURL(group, guild, page, limit);
    return axiosService.get(url).then((res) => res.data);
  }

  public async addDiscordGuild({
    id,
    guild,
    name,
  }: AddDiscordGuildAPIRequest): Promise<AddDiscordGuildAPIResponse> {
    const url = this.makeAddDiscordGuildURL(guild);

    const payload: Partial<AddDiscordGuildAPIRequest> = {
      id,
    };

    if (name) {
      payload.name = name;
    }

    return axiosService.post(url, payload).then((res) => res.data);
  }

  public async deleteDiscordGuild(
    id: string,
  ): Promise<DeleteDiscordGuildAPIResponse> {
    const url = this.makeDeleteDiscordGuildURL(id);
    return axiosService.delete(url).then((res) => res.data);
  }

  private makeGetDiscordGuildsURL(
    group?: string,
    guild?: string,
    page?: number,
    limit?: number,
  ): string {
    let url: string;

    if (group) {
      url = guild
        ? DiscordGuildsAPIService.GET_DISCORD_GUILDS_WITH_GUILD_URL.replace(
            ':group',
            group,
          ).replace(':guild', guild)
        : DiscordGuildsAPIService.GET_DISCORD_GUILDS_WITH_GROUP_URL.replace(
            ':group',
            group,
          );
    } else {
      url = DiscordGuildsAPIService.GET_DISCORD_GUILDS_URL;
    }

    return url
      .replace(':page', (page ?? 1).toString())
      .replace(':limit', (limit ?? 25).toString());
  }

  private makeAddDiscordGuildURL(guild?: string): string {
    return guild
      ? DiscordGuildsAPIService.ADD_DISCORD_GUILD_WITH_GUILD_URL.replace(
          ':guild',
          guild,
        )
      : DiscordGuildsAPIService.ADD_DISCORD_GUILD_URL;
  }

  private makeDeleteDiscordGuildURL(id: string): string {
    return DiscordGuildsAPIService.DELETE_DISCORD_GUILD_URL.replace(':id', id);
  }
}
