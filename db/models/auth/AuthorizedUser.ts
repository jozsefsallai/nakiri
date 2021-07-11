import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum UserPermissions {
  MANAGE_OWN_GUILD_BLACKLISTS = 1,
  MANAGE_GLOBAL_BLACKLISTS = 2,
  MANAGE_AUTHORIZED_USERS = 4
};

export interface IAuthorizedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  discordId: string;
  permissions: number;
}

@Entity()
export class AuthorizedUser implements IAuthorizedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  discordId: string;

  @Column('int', { default: 1 })
  permissions: number;

  private hasPermission(permission: number): boolean {
    return (this.permissions & permission) === permission;
  }

  canManageOwnGuildBlacklists(): boolean {
    return this.hasPermission(UserPermissions.MANAGE_OWN_GUILD_BLACKLISTS);
  }

  canManageGlobalBlacklists(): boolean {
    return this.hasPermission(UserPermissions.MANAGE_GLOBAL_BLACKLISTS);
  }

  canManageAuthorizedUsers(): boolean {
    return this.hasPermission(UserPermissions.MANAGE_AUTHORIZED_USERS);
  }

  toJSON(): IAuthorizedUser {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      discordId: this.discordId,
      permissions: this.permissions
    };
  }
}
