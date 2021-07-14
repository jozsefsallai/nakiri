export enum UserPermissions {
  MANAGE_OWN_GUILD_BLACKLISTS = 1 << 0,
  MANAGE_GLOBAL_BLACKLISTS    = 1 << 1,
  MANAGE_AUTHORIZED_USERS     = 1 << 2
};

export class UserPermissionsUtil {
  static hasPermission(permissions: number, permission: number): boolean {
    return (permissions & permission) === permission;
  }

  static canManageOwnGuildBlacklists(permissions: number): boolean {
    return this.hasPermission(permissions, UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS);
  }

  static canManageGlobalBlacklists(permissions: number): boolean {
    return this.hasPermission(permissions, UserPermissions.MANAGE_GLOBAL_BLACKLISTS);
  }

  static canManageAuthorizedUsers(permissions: number): boolean {
    return this.hasPermission(permissions, UserPermissions.MANAGE_AUTHORIZED_USERS);
  }
}