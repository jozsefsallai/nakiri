import axiosService, { APIResponse } from '@/services/axios';

import { IUser } from '@/lib/User';
import { IDiscordUser } from '@/typings/IDiscordUser';
import { IAuthorizedUser } from '@/db/models/auth/AuthorizedUser';

export interface GetLoggedInUserAPIResponse extends APIResponse {
  user: IUser;
};

export interface GetDiscordUserAPIResponse extends APIResponse {
  data: IDiscordUser;
};

export interface GetAuthorizedUsersAPIResponse extends APIResponse {
  users: IAuthorizedUser[];
};

export interface AuthorizeDiscordUserAPIRequest {
  discordId: string;
  permissions: number[];
};

export interface AuthorizeDiscordUserAPIResponse extends APIResponse {
};

export class UsersAPIService {
  static GET_LOGGED_IN_USER_URL = '/api/users/me';
  static GET_DISCORD_USER_URL = '/api/users/discord/:id';

  static GET_AUTHORIZED_USERS_URL = '/api/users';

  static AUTHORIZE_DISCORD_USER_URL = '/api/users/authorize';

  public async getLoggedInUser(headers?: any): Promise<GetLoggedInUserAPIResponse> {
    return axiosService.get(UsersAPIService.GET_LOGGED_IN_USER_URL, { headers })
      .then(res => res.data);
  }

  public async getDiscordUser(discordId: string): Promise<GetDiscordUserAPIResponse> {
    const url = this.makeGetDiscordUserUrl(discordId);
    return axiosService.get(url).then(res => res.data);
  }

  public async getAuthorizedUsers(): Promise<GetAuthorizedUsersAPIResponse> {
    return axiosService.get(UsersAPIService.GET_AUTHORIZED_USERS_URL)
      .then(res => res.data);
  }

  public async authorizeDiscordUser({ discordId, permissions }: AuthorizeDiscordUserAPIRequest): Promise<AuthorizeDiscordUserAPIResponse> {
    return axiosService.post(UsersAPIService.AUTHORIZE_DISCORD_USER_URL, { discordId, permissions })
      .then(res => res.data);
  }

  private makeGetDiscordUserUrl(discordId: string): string {
    return UsersAPIService.GET_DISCORD_USER_URL.replace(':id', discordId);
  }
}
