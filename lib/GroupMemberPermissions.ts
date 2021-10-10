import { UserPermissionsUtil } from './UserPermissions';

export enum GroupMemberPermissions {
  VIEW_GROUP_BLACKLISTS = 1 << 0,
  MANAGE_GROUP_ENTRIES = 1 << 1,
  SEE_API_KEY = 1 << 2,
  MANAGE_GROUP_GUILDS = 1 << 3,
  MANAGE_GROUP_MEMBERS = 1 << 4,
}

export enum GroupMemberGuildPermissions {
  ACCESS_GUILD = 1 << 0,
  MANAGE_GUILD_BLACKLISTS = 1 << 1,
}

export const ALL_PERMISSIONS =
  GroupMemberPermissions.VIEW_GROUP_BLACKLISTS |
  GroupMemberPermissions.MANAGE_GROUP_ENTRIES |
  GroupMemberPermissions.SEE_API_KEY |
  GroupMemberPermissions.MANAGE_GROUP_GUILDS |
  GroupMemberPermissions.MANAGE_GROUP_MEMBERS;

export class GroupMemberPermissionsUtil {
  static canViewGroupBlacklists(permissions: number): boolean {
    return UserPermissionsUtil.hasPermission(
      permissions,
      GroupMemberPermissions.VIEW_GROUP_BLACKLISTS,
    );
  }

  static canManageGroupEntries(permissions: number): boolean {
    return UserPermissionsUtil.hasPermission(
      permissions,
      GroupMemberPermissions.MANAGE_GROUP_ENTRIES,
    );
  }

  static canSeeApiKey(permissions: number): boolean {
    return UserPermissionsUtil.hasPermission(
      permissions,
      GroupMemberPermissions.SEE_API_KEY,
    );
  }

  static canManageGroupGuilds(permissions: number): boolean {
    return UserPermissionsUtil.hasPermission(
      permissions,
      GroupMemberPermissions.MANAGE_GROUP_GUILDS,
    );
  }

  static canManageGroupMembers(permissions: number): boolean {
    return UserPermissionsUtil.hasPermission(
      permissions,
      GroupMemberPermissions.MANAGE_GROUP_MEMBERS,
    );
  }

  static canAccessGuild(groupPermissions: number, guildPermissions): boolean {
    return (
      GroupMemberPermissionsUtil.canManageGroupGuilds(groupPermissions) ||
      UserPermissionsUtil.hasPermission(
        guildPermissions,
        GroupMemberGuildPermissions.ACCESS_GUILD,
      )
    );
  }

  static canManageGuildBlacklists(
    groupPermissions: number,
    guildPermissions,
  ): boolean {
    return (
      GroupMemberPermissionsUtil.canManageGroupGuilds(groupPermissions) ||
      UserPermissionsUtil.hasPermission(
        guildPermissions,
        GroupMemberGuildPermissions.MANAGE_GUILD_BLACKLISTS,
      )
    );
  }
}
