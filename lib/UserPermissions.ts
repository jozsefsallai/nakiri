export enum UserPermissions {
  MANAGE_OWN_GUILD_BLACKLISTS = 1 << 0,
  MANAGE_GLOBAL_BLACKLISTS = 1 << 1,
  MANAGE_AUTHORIZED_USERS = 1 << 2,
  MANAGE_MONITORED_KEYWORDS = 1 << 3,
  CREATE_GROUPS = 1 << 4,
}

export class UserPermissionsUtil {
  static hasPermission(permissions: number, permission: number): boolean {
    return (permissions & permission) === permission;
  }

  static canManageOwnGuildBlacklists(permissions: number): boolean {
    return this.hasPermission(
      permissions,
      UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS,
    );
  }

  static canManageGlobalBlacklists(permissions: number): boolean {
    return this.hasPermission(
      permissions,
      UserPermissions.MANAGE_GLOBAL_BLACKLISTS,
    );
  }

  static canManageAuthorizedUsers(permissions: number): boolean {
    return this.hasPermission(
      permissions,
      UserPermissions.MANAGE_AUTHORIZED_USERS,
    );
  }

  static canManageGuildMonitoredKeywords(permissions: number): boolean {
    return this.hasPermission(
      permissions,
      UserPermissions.MANAGE_MONITORED_KEYWORDS,
    );
  }

  static canCreateGroups(permissions: number): boolean {
    return this.hasPermission(permissions, UserPermissions.CREATE_GROUPS);
  }
}
