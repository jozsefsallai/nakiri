import { UserPermissionsUtil } from './UserPermissions';

export interface IUser {
  id: string;
  name: string;
  discriminator: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  discordId: string;
  permissions: number;
};

// I know this is code duplication, but it's pretty much the only way I can do
// this right now. Extending from AuthorizedUser will bundle typeorm too.
export class User implements IUser {
  id: string;
  name: string;
  discriminator: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  discordId: string;
  permissions: number;

  hasPermission(permission: number): boolean {
    return UserPermissionsUtil.hasPermission(this.permissions, permission);
  }

  canManageOwnGuildBlacklists(): boolean {
    return UserPermissionsUtil.canManageOwnGuildBlacklists(this.permissions);
  }

  canManageGlobalBlacklists(): boolean {
    return UserPermissionsUtil.canManageGlobalBlacklists(this.permissions);
  }

  canManageAuthorizedUsers(): boolean {
    return UserPermissionsUtil.canManageAuthorizedUsers(this.permissions);
  }

  canManageGuildMonitoredKeywords(): boolean {
    return UserPermissionsUtil.canManageGuildMonitoredKeywords(this.permissions);
  }

  constructor({ id, name, image, discriminator, discordId, createdAt, updatedAt, permissions }: IUser) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.discriminator = discriminator;
    this.discordId = discordId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.permissions = permissions;
  }
}
