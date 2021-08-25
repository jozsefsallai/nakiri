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

export interface UpdateUserAPIRequest {
  hideThumbnails?: boolean;
};

export interface UpdateUserAPIResponse extends APIResponse {
  user: IUser;
};

export interface UpdateUserPermissionsAPIRequest {
  id: string;
  permissions: number[];
};

export interface UpdateUserPermissionsAPIResponse extends APIResponse {
  user: IAuthorizedUser;
};

export interface UnauthorizeDiscordUserAPIResponse extends APIResponse {
};

export class UsersAPIService {
  static GET_LOGGED_IN_USER_URL = '/api/users/me';
  static GET_DISCORD_USER_URL = '/api/users/discord/:id';

  static GET_AUTHORIZED_USERS_URL = '/api/users';

  static AUTHORIZE_DISCORD_USER_URL = '/api/users/authorize';

  static UPDATE_USER_URL = '/api/users/me';
  static UPDATE_USER_PERMISSIONS_URL = '/api/users/:id';
  static UNAUTHORIZE_USER_URL = '/api/users/:id';

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

  public async updateUser({ hideThumbnails }: UpdateUserAPIRequest): Promise<UpdateUserAPIResponse> {
    return axiosService.patch(UsersAPIService.UPDATE_USER_URL, { hideThumbnails })
      .then(res => res.data);
  }

  public async updateUserPermissions({ id, permissions }: UpdateUserPermissionsAPIRequest): Promise<UpdateUserPermissionsAPIResponse> {
    const url = this.makeUpdateUserPermissionsUrl(id);
    return axiosService.patch(url, { permissions }).then(res => res.data);
  }

  public async unauthorizeUser(id: string): Promise<void> {
    const url = this.makekUnauthorizeUserUrl(id);
    return axiosService.delete(url).then(res => res.data);
  }

  private makeGetDiscordUserUrl(discordId: string): string {
    return UsersAPIService.GET_DISCORD_USER_URL.replace(':id', discordId);
  }

  private makeUpdateUserPermissionsUrl(id: string): string {
    return UsersAPIService.UPDATE_USER_PERMISSIONS_URL.replace(':id', id);
  }

  private makekUnauthorizeUserUrl(id: string): string {
    return UsersAPIService.UNAUTHORIZE_USER_URL.replace(':id', id);
  };
}
