import axiosService, { APIResponse } from '@/services/axios';

import { IGroup } from '@/db/models/groups/Group';

export interface GetGroupsAPIResponse extends APIResponse {
  groups: IGroup[];
}

export interface CreateGroupAPIRequest {
  name: string;
  description?: string;
}

export interface CreateGroupAPIResponse extends APIResponse {}

export interface GetGroupAPIResponse extends APIResponse {
  group: IGroup;
}

export interface AddGroupMemberAPIRequest {
  discordId: string;
  permissions: number[];
}

export interface AddGroupMemberAPIResponse extends APIResponse {
  group: IGroup;
}

export interface AddGuildToGroupAPIRequest {
  guildId: string;
}

export interface AddGuildToGroupAPIResponse extends APIResponse {
  group: IGroup;
}

export interface UpdateMemberPermissionsAPIRequest {
  permissions: number[];
}

export interface UpdateMemberPermissionsAPIResponse extends APIResponse {}

export interface RemoveGroupMemberAPIResponse extends APIResponse {
  group: IGroup;
}

export interface RemoveGroupGuildAPIResponse extends APIResponse {
  group: IGroup;
}

export interface UpdateGroupAPIRequest {
  name?: string;
  description?: string;
}

export interface UpdateGroupAPIResponse extends APIResponse {
  group: IGroup;
}

export interface UpdateGroupOwnerAPIRequest {
  newOwnerId: string;
}

export interface UpdateGroupOwnerAPIResponse extends APIResponse {}

export interface DeleteGroupAPIResponse extends APIResponse {}

export class GroupsAPIService {
  static GET_GROUPS_API_URL = '/api/groups';
  static CREATE_GROUP_API_URL = '/api/groups';
  static GET_GROUP_API_URL = '/api/groups/:id';
  static ADD_GROUP_MEMBER_API_URL = '/api/groups/:id/members';
  static ADD_GUILD_TO_GROUP_API_URL = '/api/groups/:id/guilds';
  static UPDATE_MEMBER_PERMISSIONS_API_URL = '/api/groups/:gid/members/:mid'; // might not do this
  static REMOVE_GROUP_MEMBER_API_URL = '/api/groups/:gid/members/:mid';
  static REMOVE_GROUP_GUILD_API_URL = '/api/groups/:gid/guilds/:guildId';
  static UPDATE_GROUP_API_URL = '/api/groups/:id';
  static UPDATE_GROUP_OWNER_API_URL = '/api/groups/:id/owner';
  static DELETE_GROUP_API_URL = '/api/groups/:id';

  public async getGroups(): Promise<GetGroupsAPIResponse> {
    return axiosService
      .get<GetGroupsAPIResponse>(GroupsAPIService.GET_GROUPS_API_URL)
      .then((res) => res.data);
  }

  public async createGroup({
    name,
    description,
  }: CreateGroupAPIRequest): Promise<CreateGroupAPIResponse> {
    const payload: CreateGroupAPIRequest = {
      name,
    };

    if (description) {
      payload.description = description;
    }

    return axiosService
      .post<CreateGroupAPIResponse>(
        GroupsAPIService.CREATE_GROUP_API_URL,
        payload,
      )
      .then((res) => res.data);
  }

  public async getGroup(groupId: string): Promise<GetGroupAPIResponse> {
    const url = this.makeGetGroupUrl(groupId);
    return axiosService.get<GetGroupAPIResponse>(url).then((res) => res.data);
  }

  public async addGroupMember(
    id: string,
    { discordId, permissions }: AddGroupMemberAPIRequest,
  ): Promise<AddGroupMemberAPIResponse> {
    const payload: AddGroupMemberAPIRequest = {
      discordId,
      permissions,
    };

    const url = this.makeAddGroupMemberUrl(id);
    return axiosService
      .post<AddGroupMemberAPIResponse>(url, payload)
      .then((res) => res.data);
  }

  public async addGuildToGroup(
    id: string,
    { guildId }: AddGuildToGroupAPIRequest,
  ): Promise<AddGuildToGroupAPIResponse> {
    const payload: AddGuildToGroupAPIRequest = {
      guildId,
    };

    const url = this.makeAddGuildToGroupUrl(id);
    return axiosService
      .post<AddGuildToGroupAPIResponse>(url, payload)
      .then((res) => res.data);
  }

  public async updateMemberPermissions(
    groupId: string,
    memberId: string,
    { permissions }: UpdateMemberPermissionsAPIRequest,
  ): Promise<UpdateMemberPermissionsAPIResponse> {
    const payload: UpdateMemberPermissionsAPIRequest = {
      permissions,
    };

    const url = this.makeUpdateMemberPermissionsUrl(groupId, memberId);
    return axiosService
      .put<UpdateMemberPermissionsAPIResponse>(url, payload)
      .then((res) => res.data);
  }

  public async removeGroupMember(
    groupId: string,
    memberId: string,
  ): Promise<RemoveGroupMemberAPIResponse> {
    const url = this.makeRemoveGroupMemberUrl(groupId, memberId);
    return axiosService
      .delete<RemoveGroupMemberAPIResponse>(url)
      .then((res) => res.data);
  }

  public async removeGroupGuild(
    groupId: string,
    guildId: string,
  ): Promise<RemoveGroupGuildAPIResponse> {
    const url = this.makeRemoveGroupGuildUrl(groupId, guildId);
    return axiosService
      .delete<RemoveGroupGuildAPIResponse>(url)
      .then((res) => res.data);
  }

  public async updateGroup(
    id: string,
    { name, description }: UpdateGroupAPIRequest,
  ): Promise<UpdateGroupAPIResponse> {
    const payload: UpdateGroupAPIRequest = {};

    if (name) {
      payload.name = name;
    }

    if (description) {
      payload.description = description;
    }

    const url = this.makeUpdateGroupUrl(id);
    return axiosService
      .put<UpdateGroupAPIResponse>(url, payload)
      .then((res) => res.data);
  }

  public async updateGroupOwner(
    id: string,
    { newOwnerId }: UpdateGroupOwnerAPIRequest,
  ): Promise<UpdateGroupOwnerAPIResponse> {
    const payload: UpdateGroupOwnerAPIRequest = {
      newOwnerId,
    };

    const url = this.makeUpdateGroupOwnerUrl(id);
    return axiosService
      .put<UpdateGroupOwnerAPIResponse>(url, payload)
      .then((res) => res.data);
  }

  public async deleteGroup(id: string): Promise<DeleteGroupAPIResponse> {
    const url = this.makeDeleteGroupUrl(id);
    return axiosService
      .delete<DeleteGroupAPIResponse>(url)
      .then((res) => res.data);
  }

  private makeGetGroupUrl(groupId: string): string {
    return GroupsAPIService.GET_GROUP_API_URL.replace(':id', groupId);
  }

  private makeAddGroupMemberUrl(groupId: string): string {
    return GroupsAPIService.ADD_GROUP_MEMBER_API_URL.replace(':id', groupId);
  }

  private makeAddGuildToGroupUrl(groupId: string): string {
    return GroupsAPIService.ADD_GUILD_TO_GROUP_API_URL.replace(':id', groupId);
  }

  private makeUpdateMemberPermissionsUrl(
    groupId: string,
    memberId: string,
  ): string {
    return GroupsAPIService.UPDATE_MEMBER_PERMISSIONS_API_URL.replace(
      ':gid',
      groupId,
    ).replace(':mid', memberId);
  }

  private makeRemoveGroupMemberUrl(groupId: string, memberId: string): string {
    return GroupsAPIService.REMOVE_GROUP_MEMBER_API_URL.replace(
      ':gid',
      groupId,
    ).replace(':mid', memberId);
  }

  private makeRemoveGroupGuildUrl(groupId: string, guildId: string): string {
    return GroupsAPIService.REMOVE_GROUP_GUILD_API_URL.replace(
      ':gid',
      groupId,
    ).replace(':guildId', guildId);
  }

  private makeUpdateGroupUrl(groupId: string): string {
    return GroupsAPIService.UPDATE_GROUP_API_URL.replace(':id', groupId);
  }

  private makeUpdateGroupOwnerUrl(groupId: string): string {
    return GroupsAPIService.UPDATE_GROUP_OWNER_API_URL.replace(':id', groupId);
  }

  private makeDeleteGroupUrl(groupId: string): string {
    return GroupsAPIService.DELETE_GROUP_API_URL.replace(':id', groupId);
  }
}
